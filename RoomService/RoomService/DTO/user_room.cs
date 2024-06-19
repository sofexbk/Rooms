using Microsoft.AspNetCore.Mvc;
using RoomService.Models;

namespace RoomService.DTO;

public class user_room
{
    public int userId { get; set; }
    public int roomId { get; set; }
}