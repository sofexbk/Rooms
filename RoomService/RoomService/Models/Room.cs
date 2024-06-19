using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using RoomService.DTO;

namespace RoomService.Models;

public class Room
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public DateTime createdAt { get; set; }
}