using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System;
using MailKit.Security;
using AuthService.Services.Email;

namespace AuthService.Controllers;
[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    private IActionResult SendEmail(string receiverMail, string body)
    {
        _emailService.SendEmail(receiverMail,body);
        return Ok();
    }
}
