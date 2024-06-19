using Microsoft.AspNetCore.Mvc;
using RoomService.Models;

namespace RoomService.DTO;

public class room_role
{
    public Room room { get; set; }
    public int roomId { get; set; }
    public bool isAdmin { get; set; }
}