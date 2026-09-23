using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using EmailApi.Models;
using EmailApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmailApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController(
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    ILogger<PaymentController> logger) : ControllerBase
{
    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder([FromBody] AdmissionPaymentRequest request)
    {
        var validationError = AdmissionPaymentRequestValidator.Validate(request);
        if (!string.IsNullOrWhiteSpace(validationError))
        {
            return BadRequest(new { message = validationError });
        }

        var orderId = $"BF-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}";
        var receipt = $"RCPT-{DateTime.UtcNow:yyyyMMddHHmmss}";
        var appUrl = configuration["Cashfree:FrontendUrl"] ?? "http://localhost:5173";
        var successUrl = configuration["Cashfree:SuccessUrl"] ?? $"{appUrl}/payment-success";
        var failureUrl = configuration["Cashfree:FailureUrl"] ?? $"{appUrl}/admission";

        var clientId = configuration["Cashfree:ClientId"];
        var clientSecret = configuration["Cashfree:ClientSecret"];
        var baseUrl = configuration["Cashfree:BaseUrl"] ?? "https://sandbox.cashfree.com/pg";

        if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(clientSecret))
        {
            var demoLink =
                $"{successUrl}?orderId={Uri.EscapeDataString(orderId)}&receipt={Uri.EscapeDataString(receipt)}" +
                $"&studentName={Uri.EscapeDataString(request.StudentName)}&courseName={Uri.EscapeDataString(request.CourseName)}" +
                $"&amount={request.Amount}&mobile={Uri.EscapeDataString(request.Mobile)}&email={Uri.EscapeDataString(request.Email)}";

            return Ok(new
            {
                message = "Cashfree credentials are not configured. Demo payment mode is active.",
                mode = "demo",
                orderId,
                receipt,
                amount = request.Amount,
                currency = "INR",
                paymentLink = demoLink
            });
        }

        try
        {
            var returnUrl = $"{successUrl}?orderId={Uri.EscapeDataString(orderId)}&receipt={Uri.EscapeDataString(receipt)}" +
                $"&studentName={Uri.EscapeDataString(request.StudentName)}&courseName={Uri.EscapeDataString(request.CourseName)}" +
                $"&amount={request.Amount}&mobile={Uri.EscapeDataString(request.Mobile)}&email={Uri.EscapeDataString(request.Email)}";

            var cashfreeRequest = new
            {
                order_id = orderId,
                order_amount = request.Amount,
                order_currency = "INR",
                order_note = $"Admission fee for {request.CourseName}",
                customer_details = new
                {
                    customer_name = request.StudentName,
                    customer_email = request.Email,
                    customer_phone = request.Mobile
                },
                order_meta = new
                {
                    return_url = returnUrl,
                    notify_url = $"{appUrl}/api/payment/notify",
                    payment_methods = "card,upi,wallet,netbanking"
                }
            };

            var client = httpClientFactory.CreateClient();
            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/orders");
            httpRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpRequest.Headers.Add("x-client-id", clientId);
            httpRequest.Headers.Add("x-client-secret", clientSecret);
            httpRequest.Content = JsonContent.Create(cashfreeRequest);

            var response = await client.SendAsync(httpRequest);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                logger.LogError("Cashfree order creation failed. StatusCode={StatusCode}. Response={Response}", response.StatusCode, responseBody);
                return StatusCode(StatusCodes.Status502BadGateway, new { message = "Payment gateway is currently unavailable. Please try again later." });
            }

            var payload = JsonDocument.Parse(responseBody).RootElement;
            var paymentLink = payload.TryGetProperty("payment_link", out var paymentLinkProperty)
                ? paymentLinkProperty.GetString()
                : payload.TryGetProperty("link", out var linkProperty)
                    ? linkProperty.GetString()
                    : null;

            if (string.IsNullOrWhiteSpace(paymentLink))
            {
                logger.LogWarning("Cashfree response did not include a payment link: {ResponseBody}", responseBody);
                return StatusCode(StatusCodes.Status502BadGateway, new { message = "Payment link was not created. Please try again." });
            }

            return Ok(new
            {
                message = "Payment session created successfully.",
                mode = "cashfree",
                orderId,
                receipt,
                amount = request.Amount,
                currency = "INR",
                paymentLink
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while creating Cashfree payment order.");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = "Unable to create payment right now. Please try after some time."
            });
        }
    }

    [HttpGet("success")]
    public IActionResult Success(string orderId, string receipt, string studentName, string courseName, decimal amount, string mobile, string email)
    {
        return Ok(new
        {
            orderId,
            receipt,
            studentName,
            courseName,
            amount,
            mobile,
            email,
            status = "success"
        });
    }
}
