using System.ComponentModel.DataAnnotations.Schema;

namespace RoomService.Models;

public class User
{
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