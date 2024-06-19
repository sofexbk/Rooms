using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Web;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Oauth2.v2;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using MailKit.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using MimeKit.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Octokit;
using Org.BouncyCastle.Crypto.Generators;
using AuthService.Services.Email;
using AuthService.Services.Email;
using ProductHeaderValue = Octokit.ProductHeaderValue;
using User = AuthService.Models.User;

namespace AuthService.Controllers;

[Route("api/")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly UserContext _context;
    private readonly IEmailService _emailService;
    private readonly ISMSService _smsService;

    public AuthController(IConfiguration configuration, UserContext context, IEmailService emailService,
        ISMSService smsService)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        _smsService = smsService ?? throw new ArgumentNullException(nameof(smsService));
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(UserCreationDTO request)
    {
        if (_context.Users.Any(u => u.email == request.email)) return BadRequest("User with this email already exists");
        var newUser = new User
        {
            firstName = request.firstName,
            lastName = request.lastName,
            email = request.email,
            passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password),
            dateOfBirth = request.dateOfBirth,
            phoneNumber = request.phoneNumber,
            dateOfCreation = DateTime.Now
        };
        _context.Users.Add(newUser);
        try
        {
            await _context.SaveChangesAsync();
            return Ok("User added");
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, "Error saving to the database");
        }
    }


    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(UserLoginDTO request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);
        if (user == null) return NotFound("User not found");

        if (!BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash)) return BadRequest("Password is incorrect");

        // Create claims for the user
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.email),
            new Claim(ClaimTypes.Email, user.email),
            new Claim(ClaimTypes.GivenName, user.firstName),
            new Claim(ClaimTypes.Surname, user.lastName),
            new Claim(ClaimTypes.MobilePhone, user.phoneNumber),
            new Claim(ClaimTypes.DateOfBirth, user.dateOfBirth.ToString(),
                ClaimValueTypes.Date), // Assuming dateOfBirth is of type DateOnly
            new Claim("dateOfCreation", user.dateOfCreation.ToString("o"),
                ClaimValueTypes.DateTime), // Custom claim for dateOfCreation
            // Add other claims as needed
        };

        // Create identity and principle
        var identity = new ClaimsIdentity(claims, "custom");
        var principal = new ClaimsPrincipal(identity);

        // Set the identity for the current context
        HttpContext.User = principal;

        var accessToken = createToken(user);
        return Ok(new {user,accessToken});
    }


    // This attribute ensures that only authenticated users can access this action


    [HttpPost("forget_password")]
    public async Task<IActionResult> ForgetPassword(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email && u.isGoogle == null && u.isGithub ==null );
        if (user == null) return NotFound("User not found or coming from Github or Google");

        var resetPasswordToken = createRandomToken();

        user.resetPasswordToken = resetPasswordToken.Item1; // token string
        user.resetPasswordTokenExpiring = resetPasswordToken.Item2; // expiring date
        _emailService.SendEmail(user.email, resetPasswordToken.Item1);
        if(user.phoneNumber != null){
        _smsService.SendSMS(user.phoneNumber,
            "Bonjour " + user.firstName +
            ".\n\nRenitialisation de votre mot de passe.\n\nVous recevez dans votre boite mail un lien pour rénitialiser votre mot de pass.\n\n Si vous n'avez rien fait, Prière de ne pas cliquer la dessus.");
        }
        await _context.SaveChangesAsync();
        return Ok("check your email");
    }

    [HttpPost("reset_password")]
    public async Task<IActionResult> ResetPassword(string resetPasswordToken, string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.resetPasswordToken == resetPasswordToken);
        if (user == null || user.resetPasswordTokenExpiring < DateTime.Now) return BadRequest("Token Expired");

        user.passwordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();
        return Ok("Password reseted");
    }
    
    [HttpGet("allusers")]
    [ProducesResponseType(typeof(List<User>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }
    
    [HttpGet("userbyid/{id}")] 
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.id == id); // Assuming your User entity has an 'Id' property
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    
    [HttpGet("connected_profile")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult GetProfile()
    {
        // Accessing user claims
        var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
        var firstName = HttpContext.User.FindFirst(ClaimTypes.GivenName)?.Value;
        var lastName = HttpContext.User.FindFirst(ClaimTypes.Surname)?.Value;
        var phoneNumber = HttpContext.User.FindFirst(ClaimTypes.MobilePhone)?.Value;
        var role = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        var dateOfBirthString = HttpContext.User.FindFirst(ClaimTypes.DateOfBirth)?.Value;
        var dateOfBirth = string.IsNullOrEmpty(dateOfBirthString)
            ? default(DateOnly)
            : DateOnly.Parse(dateOfBirthString);
        var dateOfCreationString = HttpContext.User.FindFirst("dateOfCreation")?.Value;
        var dateOfCreation = string.IsNullOrEmpty(dateOfCreationString)
            ? default(DateTime)
            : DateTime.Parse(dateOfCreationString);

        // Use the retrieved claims as needed
        // ...

        return Ok(new
        {
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = phoneNumber,
            Role = role,
            DateOfBirth = dateOfBirth,
            DateOfCreation = dateOfCreation
        });
    }

    private string createToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.email),
        };
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: credentials
        );
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
    }

    private (string, DateTime) createRandomToken()
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var expires = DateTime.Now.AddMinutes(15);

        var token = new JwtSecurityToken(
            expires: expires,
            signingCredentials: credentials
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return (jwt, expires);
    }

    [HttpPost("continue_with_github")]
    public OkObjectResult ContinueWithGithub()
    {
        var ClientId = "60477e84c1636f57d203";
        var RedirectUrl = "http://localhost:5173/githubRedirect";
        var string_url = "https://github.com/login/oauth/authorize?client_id=" + ClientId + "&redirect_uri=" +
                         RedirectUrl + "&scope=read:user,user:email";
        return Ok(string_url);
    }

    private static readonly HttpClient client1 = new HttpClient();

    private static async Task<string> GetUserEmail(string accessToken)
    {
        // Set up request headers
        client1.DefaultRequestHeaders.Clear();
        client1.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("token", accessToken);
        client1.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
        client1.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
        client1.DefaultRequestHeaders.Add("User-Agent", "XSpace");
        // Make request to /user/emails endpoint
        HttpResponseMessage response = await client1.GetAsync("https://api.github.com/user/emails");

        // Read response content as string
        string responseBody = await response.Content.ReadAsStringAsync();

        dynamic[] emailObjects = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic[]>(responseBody);

        // Extract emails
        string[] emails = new string[emailObjects.Length];
        for (int i = 0; i < emailObjects.Length; i++)
        {
            emails[i] = emailObjects[i].email;
        }

        return emails.First();
    }

    [HttpGet("githubRedirect")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> GithubRedirect([FromQuery] string code)
    {
        var client = new HttpClient();
        var ClientId = "60477e84c1636f57d203";
        var RedirectUrl = "http://localhost:5173/githubRedirect";
        var ClientSecret = "5bdb8df7f2d189c0a3a55b4526082ad69cc751e6";
        var parameters = new Dictionary<string, string>
        {
            { "client_id", ClientId },
            { "client_secret", ClientSecret },
            { "code", code },
            { "redirect_uri", RedirectUrl }
        };
        var content = new FormUrlEncodedContent(parameters);
        var response = await client.PostAsync("https://github.com/login/oauth/access_token", content);
        var responseContent = await response.Content.ReadAsStringAsync();
        var values = HttpUtility.ParseQueryString(responseContent);
        var accessToken = values["access_token"];
        var client1 = new GitHubClient(new ProductHeaderValue("XSpace"));
        var tokenAuth = new Credentials(accessToken);
        client1.Credentials = tokenAuth;
        var githubUser = await client1.User.Current();
        var githubEmail = await GetUserEmail(accessToken);
        var githubUserEmail = githubEmail.ToString();
        
        // chercher dans la base des données based on githubUsername (login)
        var userDb = await _context.Users.FirstOrDefaultAsync(u => u.email == githubUserEmail);
        // Si l'user se connecte avec son compte github la premiere fois ( userDb n'existe pas )
        if (userDb == null) // Like register
        {
            var newUser = new User
            {
                firstName = githubUser.Name,
                lastName = "",
                email = githubUserEmail,
                phoneNumber = "",
                passwordHash = BCrypt.Net.BCrypt.HashPassword(githubUser.NodeId), // take nodeId as his password to hash
                dateOfBirth = DateOnly.MinValue,
                dateOfCreation = DateTime.Now,
                avatarUrl = githubUser.AvatarUrl,
                isGithub = true,
            };
            _context.Users.Add(newUser);
            try
            {
                await _context.SaveChangesAsync();
                userDb = newUser;
                return Ok(new {userDb,accessToken});
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "Error saving to the database");
            }
        }
        else // Like login
        {
            //userDb is the object
            
            return Ok(new {userDb,accessToken});
            
        }
    }

    [HttpPost("continue_with_google")]
    public async Task<IActionResult> continueWithGoogle()
    {
        var initializer = new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = "593638247079-q1tb35b7fcfmoq7k5plqgr8c2vvh9otm.apps.googleusercontent.com",
                ClientSecret = "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",
            },
            Scopes = new[]
                { Oauth2Service.Scope.UserinfoProfile, Oauth2Service.Scope.UserinfoEmail, Oauth2Service.Scope.Openid },
            DataStore = new FileDataStore("TokenStorage"),
        };
        var flow = new GoogleAuthorizationCodeFlow(initializer);
        var authUrl = flow.CreateAuthorizationCodeRequest("http://localhost:5173/googleredirect").Build()
            .ToString();
        return Ok(authUrl);
    }


    [HttpGet("googleRedirect")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> GoogleRedirect([FromQuery] string code)
    {
        var client = new HttpClient();
        var clientId = "593638247079-q1tb35b7fcfmoq7k5plqgr8c2vvh9otm.apps.googleusercontent.com";
        var redirectUrl = "http://localhost:5173/googleredirect";
        var clientSecret = "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";
        var parameters = new Dictionary<string, string>
        {
            { "code", code },
            { "client_id", clientId },
            { "client_secret", clientSecret },
            { "redirect_uri", redirectUrl },
            { "grant_type", "authorization_code" }
        };

        var content = new FormUrlEncodedContent(parameters);
        var response = await client.PostAsync("https://oauth2.googleapis.com/token", content);

        if (response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<GoogleTokenResponse>(responseContent);

            var accessToken = tokenResponse.access_token;
            var idToken = tokenResponse.id_token;

            // Now, you can use the accessToken to get user data
            var googleUser = await GetGoogleUserData(accessToken);


            // chercher dans la base des données based on google Email 
            var userDb = await _context.Users.FirstOrDefaultAsync(u => u.email == googleUser.email);

            // Si l'user se connecte avec son compte google la premiere fois ( userDb n'existe pas )
            if (userDb == null) // Like register
            {
                var ln = googleUser?.family_name ?? "";
                var newUser = new User
                {
                    firstName = googleUser.given_name,
                    lastName = ln,
                    email = googleUser.email,
                    phoneNumber = "",
                    passwordHash = BCrypt.Net.BCrypt.HashPassword(googleUser.id), // take nodeId as his password to hash
                    dateOfBirth = DateOnly.MinValue,
                    dateOfCreation = DateTime.Now,
                    avatarUrl = googleUser.picture,
                    isGoogle = true,
                };
                _context.Users.Add(newUser);
                try
                {
                    await _context.SaveChangesAsync();
                    userDb = newUser;
                    return Ok(new {userDb,accessToken});
                }
                catch (DbUpdateException)
                {
                    return StatusCode(500, "Error saving to the database");
                }
            }
            else // Like login
            {
                //userDb is the object
                return Ok(new {userDb,accessToken});
            }
        }
        else
        {
            return BadRequest("Failed to get access token.");
        }
    }

    public class GoogleTokenResponsee : GoogleTokenResponse
    {
        public string id { get; set; }
        public string email { get; set; }
        public bool verified_email { get; set; }
        public string name { get; set; }
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string picture { get; set; }
        public string locale { get; set; }
        public string hd { get; set; }
    }

    private async Task<GoogleTokenResponsee> GetGoogleUserData(string accessToken)
    {
        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

            HttpResponseMessage response = await client.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
            var responseContent = await response.Content.ReadAsStringAsync();
            var userInfo = JsonConvert.DeserializeObject<GoogleTokenResponsee>(responseContent);
            return userInfo;
        }
    }

// Define a class to represent the Google OAuth token response
    public class GoogleTokenResponse
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string refresh_token { get; set; }
        public string id_token { get; set; }
    }
}