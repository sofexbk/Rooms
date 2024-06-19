namespace AuthService.Models;

public class UserLoginDTO
{
    public string email { get; set; } = string.Empty;
    public required string password { get; set; }
}