using System.Runtime.InteropServices.JavaScript;
using Twilio.Types;

namespace AuthService.Models;

public class UserCreationDTO
{
    public required string firstName { get; set; }
    public required string lastName { get; set; }
    public required string email { get; set; }

    [MinLength(6, ErrorMessage = "Please enter at least 6 characters in your password")]
    public required string password { get; set; }

    [Compare("password", ErrorMessage = "Password doesn't match")]
    public required string passwordConfirmation { get; set; }
    public required string phoneNumber { get; set; }

    public DateOnly dateOfBirth { get; set; } 
}