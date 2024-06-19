using Microsoft.AspNetCore.Mvc;
using RoomService.Models;

namespace RoomService.DTO;

public class user_role
{
    public User user { get; set; }
    public bool isAdmin { get; set; }
    public DateTime joinedAt { get; set; }
}