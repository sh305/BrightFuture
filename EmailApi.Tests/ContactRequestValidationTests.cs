using EmailApi.Models;
using EmailApi.Services;

namespace EmailApi.Tests;

public class ContactRequestValidationTests
{
    [Fact]
    public void Validate_ForValidRequest_ReturnsNoError()
    {
        var request = new ContactRequest
        {
            Name = "Amit Sharma",
            Mobile = "9876543210",
            Email = "amit@example.com",
            Message = "I want to join the course."
        };

        var result = ContactRequestValidator.Validate(request);

        Assert.Null(result);
    }

    [Fact]
    public void Validate_ForInvalidEmail_ReturnsValidationError()
    {
        var request = new ContactRequest
        {
            Name = "Amit Sharma",
            Mobile = "9876543210",
            Email = "invalid-email",
            Message = "I want to join the course."
        };

        var result = ContactRequestValidator.Validate(request);

        Assert.Equal("Please enter a valid email address.", result);
    }

    [Fact]
    public void Validate_ForMissingRequiredFields_ReturnsValidationError()
    {
        var request = new ContactRequest
        {
            Name = "",
            Mobile = "",
            Email = "amit@example.com",
            Message = ""
        };

        var result = ContactRequestValidator.Validate(request);

        Assert.Equal("All fields are required: name, mobile, email, and message.", result);
    }
}
