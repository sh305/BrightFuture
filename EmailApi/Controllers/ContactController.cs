using EmailApi.Models;
using EmailApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmailApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController(
    EmailService emailService,
    ILogger<ContactController> logger,
    IWebHostEnvironment environment) : ControllerBase
{
    // Post Methods
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ContactRequest request)
    {
        var validationError = ContactRequestValidator.Validate(request);
        if (!string.IsNullOrWhiteSpace(validationError))
        {
            return BadRequest(new { message = validationError });
        }

        try
        {
            await emailService.SendAsync(request);
            return Ok(new { message = "Message sent successfully. We will contact you soon." });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send contact form email.");

            var debugMessage = environment.IsDevelopment()
                ? $"{ex.Message}{(ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : string.Empty)}"
                : "Message could not be sent right now. Please try again or contact us on WhatsApp.";

            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = environment.IsDevelopment() ? "SMTP error details are visible in development mode." : "Message could not be sent right now. Please try again or contact us on WhatsApp.",
                debug = debugMessage,
                fullError = environment.IsDevelopment() ? ex.ToString() : null
            });
        }
    }
}
