using EmailApi.Models;

namespace EmailApi.Services;

public static class ContactRequestValidator
{
    public static string? Validate(ContactRequest? request)
    {
        if (request is null)
        {
            return "All fields are required: name, mobile, email, and message.";
        }

        var trimmedName = request.Name?.Trim() ?? string.Empty;
        var trimmedMobile = request.Mobile?.Trim() ?? string.Empty;
        var trimmedEmail = request.Email?.Trim() ?? string.Empty;
        var trimmedMessage = request.Message?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(trimmedName) ||
            string.IsNullOrWhiteSpace(trimmedMobile) ||
            string.IsNullOrWhiteSpace(trimmedEmail) ||
            string.IsNullOrWhiteSpace(trimmedMessage))
        {
            return "All fields are required: name, mobile, email, and message.";
        }

        var emailPattern = new System.Text.RegularExpressions.Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
        if (!emailPattern.IsMatch(trimmedEmail))
        {
            return "Please enter a valid email address.";
        }

        var mobilePattern = new System.Text.RegularExpressions.Regex("^[6-9]\\d{9}$");
        if (!mobilePattern.IsMatch(trimmedMobile.Replace(" ", string.Empty)))
        {
            return "Please enter a valid 10-digit mobile number starting with 6 to 9.";
        }

        return null;
    }
}
