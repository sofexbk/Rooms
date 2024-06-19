using Microsoft.AspNetCore.Mvc;

namespace RoomService.Services;

using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RoomService.Models;

public class UserService
{
    private readonly HttpClient _httpClient;

    public UserService(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
    }

    public Task<User> GetUserAsync(int userId)
    {
        string url = "http://localhost:5020/api/userbyid/" + userId; 
        return FetchUserAsync(url);
    }

    private async Task<User> FetchUserAsync(string url)
    {
        HttpResponseMessage response = await _httpClient.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var user = JsonConvert.DeserializeObject<User>(content);
            return user;
        }
        return null;
    }
}