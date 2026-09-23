using EmailApi.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace EmailApi.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger)
{
    public async Task SendAsync(ContactRequest request)
    {
        var smtp = configuration.GetSection("Smtp").Get<EmailOptions>() ?? new EmailOptions();

        if (string.IsNullOrWhiteSpace(smtp.Host) ||
            string.IsNullOrWhiteSpace(smtp.Username) ||
            string.IsNullOrWhiteSpace(smtp.Password) ||
            string.IsNullOrWhiteSpace(smtp.From) ||
            string.IsNullOrWhiteSpace(smtp.To))
        {
            throw new InvalidOperationException("SMTP configuration is missing.");
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(smtp.From));
            message.To.Add(MailboxAddress.Parse(smtp.To));
            message.ReplyTo.Add(MailboxAddress.Parse(request.Email));
            message.Subject = $"New enquiry from {request.Name}";
            message.Body = new TextPart("plain")
            {
                Text = $"Name: {request.Name}\n" +
                       $"Mobile: {request.Mobile}\n" +
                       $"Email: {request.Email}\n\n" +
                       $"Message:\n{request.Message}"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(smtp.Host, smtp.Port, smtp.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);
            await client.AuthenticateAsync(smtp.Username, smtp.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "SMTP email send failed. Host={Host} Port={Port} Username={Username}", smtp.Host, smtp.Port, smtp.Username);
            throw;
        }
    }
}
