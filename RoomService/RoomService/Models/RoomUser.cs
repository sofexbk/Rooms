namespace RoomService.Models
{
    public class RoomUser
    {
        public int roomId { get; set; }
        public int userId { get; set; } 
        public DateTime joinedAt { get; set; }
        public bool isAdmin { get; set; }
        
        

    }
}
