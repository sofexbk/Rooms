using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices.JavaScript;
using Twilio.Types;

namespace AuthService.Models;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int id { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string email { get; set; }
    public string passwordHash { get; set; }
    public string phoneNumber { get; set; }
    public DateOnly dateOfBirth { get; set; }
    public DateTime dateOfCreation { get; set; }
    public string? avatarUrl { get; set; }
    public string? resetPasswordToken { get; set; }
    public DateTime? resetPasswordTokenExpiring { get; set; }
    public Boolean? isGoogle { get; set; }
    public Boolean? isGithub { get; set; }

}