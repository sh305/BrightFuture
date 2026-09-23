using EmailApi.Models;
using System.Text.RegularExpressions;

namespace EmailApi.Services;

public static partial class AdmissionPaymentRequestValidator
{
    public static string? Validate(AdmissionPaymentRequest? request)
    {
        if (request is null)
        {
            return "Student name, mobile, email, course, and a valid amount are required.";
        }

        var studentName = request.StudentName?.Trim() ?? string.Empty;
        var mobile = request.Mobile?.Trim() ?? string.Empty;
        var email = request.Email?.Trim() ?? string.Empty;
        var courseName = request.CourseName?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(studentName) ||
            string.IsNullOrWhiteSpace(mobile) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(courseName) ||
            request.Amount <= 0)
        {
            return "Student name, mobile, email, course, and a valid amount are required.";
        }

        if (!EmailRegex().IsMatch(email))
        {
            return "Please enter a valid email address.";
        }

        if (!MobileRegex().IsMatch(mobile.Replace(" ", string.Empty)))
        {
            return "Please enter a valid 10-digit mobile number starting with 6 to 9.";
        }

        return null;
    }

    [GeneratedRegex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex("^[6-9]\\d{9}$")]
    private static partial Regex MobileRegex();
}
