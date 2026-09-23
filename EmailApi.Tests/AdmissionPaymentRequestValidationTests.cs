using EmailApi.Models;
using EmailApi.Services;

namespace EmailApi.Tests;

public class AdmissionPaymentRequestValidationTests
{
    [Fact]
    public void Validate_ForValidAdmissionRequest_ReturnsNoError()
    {
        var request = new AdmissionPaymentRequest
        {
            StudentName = "Amit Sharma",
            Mobile = "9876543210",
            Email = "amit@example.com",
            CourseName = "Web Development",
            Amount = 12000m
        };

        var result = AdmissionPaymentRequestValidator.Validate(request);

        Assert.Null(result);
    }

    [Fact]
    public void Validate_ForMissingRequiredFields_ReturnsValidationError()
    {
        var request = new AdmissionPaymentRequest
        {
            StudentName = "",
            Mobile = "",
            Email = "",
            CourseName = "",
            Amount = 0m
        };

        var result = AdmissionPaymentRequestValidator.Validate(request);

        Assert.Equal("Student name, mobile, email, course, and a valid amount are required.", result);
    }

    [Fact]
    public void Validate_ForInvalidAmount_ReturnsValidationError()
    {
        var request = new AdmissionPaymentRequest
        {
            StudentName = "Amit Sharma",
            Mobile = "9876543210",
            Email = "amit@example.com",
            CourseName = "Web Development",
            Amount = -1m
        };

        var result = AdmissionPaymentRequestValidator.Validate(request);

        Assert.Equal("Student name, mobile, email, course, and a valid amount are required.", result);
    }
}
