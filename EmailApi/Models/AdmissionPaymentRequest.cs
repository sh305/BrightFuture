namespace EmailApi.Models;

public class AdmissionPaymentRequest
{
    public string StudentName { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
