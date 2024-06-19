using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RoomService.Data;
using RoomService.DTO;
using RoomService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using RoomService.Services;

namespace RoomService.Controllers
{
    [Route("api/room")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly RoomContext _context;
        private readonly UserService _userService;

        public RoomController(RoomContext context, UserService userService)
        {
            _context = context;
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        // Get USERS of 1 room
        [HttpGet("/getusers")]
        public async Task<ActionResult<List<user_role>>> GetRoomUsers(int roomId)
        {
            var roomUsers = await _context.RoomUsers
                .Where(ru => ru.roomId == roomId)
                .ToListAsync();

            var usersAndRoles = new List<user_role>();
            foreach (var ru in roomUsers)
            {
                var ur = new user_role
                {
                    user = await _userService.GetUserAsync(ru.userId),
                    isAdmin = ru.isAdmin,
                    joinedAt = ru.joinedAt
                };
                usersAndRoles.Add(ur);
            }

            return usersAndRoles;
        }
        
        // Get ADMIN of 1 room
        [HttpGet("/getadmin")]
        public async Task<ActionResult<int>> GetRoomAdmin(int roomId)
        {
            var adminUser = await _context.RoomUsers
                .Where(ru => ru.roomId == roomId && ru.isAdmin)
                .FirstAsync();
            return adminUser.userId;
        }

        // Get ROOMS of 1 user
        [HttpGet("/getRooms")]
        public async Task<ActionResult<List<room_role>>> GetUserRooms(int userId)
        {
            var userRooms = await _context.RoomUsers
                .Where(ur => ur.userId == userId)
                .ToListAsync();
            if (userRooms == null) return BadRequest("No room for this user");

            var roomsAndRoles = new List<room_role>();
            foreach (var ur in userRooms)
            {
                var rr = new room_role
                {
                    room = await _context.Rooms.FindAsync(ur.roomId),
                    roomId = ur.roomId,
                    isAdmin = ur.isAdmin
                };
                roomsAndRoles.Add(rr);
            }

            return roomsAndRoles;
        }


        [HttpPost("/addroomuser")]
        public async Task<IActionResult> AddRoomUser([FromBody] RoomUser request)
        {
            // If User already exists in the same room
            var roomUsers = await _context.RoomUsers
                .Where(ru => ru.userId == request.userId && ru.roomId == request.roomId)
                .ToListAsync();
            if (roomUsers == null) return BadRequest("This user already exists in the room");
            //if the user doesn't exist
            var roomUser = new RoomUser
            {
                userId = request.userId,
                roomId = request.roomId,
                isAdmin = request.isAdmin,
                joinedAt = DateTime.Now
            };
            _context.RoomUsers.AddAsync(roomUser);
            await _context.SaveChangesAsync();

            return Ok("User added");
        }

        [HttpGet("/getRoom/{roomId}")]
        public async Task<ActionResult<Room>> GetRoom(int roomId)
        {
            var room = await _context.Rooms
                .Where(room => room.Id == roomId)
                .ToListAsync();
            return Ok(room);
        }

        // Add a new room
        [HttpPost("/addroom")]
        public async Task<IActionResult> AddRoom(RoomCreateDto requestAddRoom)
        {
            try
            {
                var room = new Room
                {
                    name = requestAddRoom.name,
                    description = requestAddRoom.description,
                    createdAt = DateTime.Now,
                };
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();

                var admin = new RoomUser
                {
                    roomId = room.Id,
                    userId = requestAddRoom.adminId,
                    isAdmin = true,
                    joinedAt = DateTime.Now
                };

                _context.RoomUsers.AddAsync(admin);
                await _context.SaveChangesAsync();

                return Ok(room);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while adding the room.");
            }
        }

        [HttpPut("/updateroom")]
        public async Task<IActionResult> UpdateRoom(RoomUpdateDto request)
        {
            var room = await _context.Rooms.FindAsync(request.roomId);
            if (room == null)
                return NotFound("Le produit n'existe pas.");
            room.name = request.name;
            room.description = request.description;
            await _context.SaveChangesAsync();
            return Ok("Room updated.");
        }


        [HttpDelete("/deleteroom")]
        public async Task<IActionResult> DeleteRoom(int roomId)
        {
            var roomUsers = await _context.RoomUsers
                .Where(ru => ru.roomId == roomId)
                .ToListAsync();
            foreach (var ru in roomUsers)
            {
                _context.RoomUsers.Remove(ru);
            }

            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
            {
                return NotFound("Room not found");
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return Ok("Room deleted.");
        }

        [HttpDelete("/unlinkuser")]
        public async Task<IActionResult> UnlinkUser(user_room request) 
        {
            var roomUser = await _context.RoomUsers
                .Where(ru => ru.userId == request.userId && ru.roomId == request.roomId)
                .FirstAsync();
            if (roomUser.isAdmin == true) return BadRequest("Can't unlink the admin");
            _context.RoomUsers.Remove(roomUser);
            await _context.SaveChangesAsync();
            return Ok("User unlinked.");
        }
        
    }
}