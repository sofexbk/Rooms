using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System;
using MailKit.Security;
using AuthService.Services.SMS;
using Twilio;
using Twilio.Types;
using Twilio.Rest.Api.V2010;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Rest.Insights.V1;
using Infobip;
using Infobip.Api.Client;
using AuthService.Services.Email;
using RestSharp;

namespace AuthService.Controllers;
[ApiController]
[Route("api/[controller]")]
public class SMSController : ControllerBase
{
    private readonly ISMSService _smsService;

    public SMSController(ISMSService smsService)
    {
        _smsService = smsService;
    }

    private IActionResult SendSMS(string phoneNumber, string message)
    {
        _smsService.SendSMS(phoneNumber,message);
        return Ok();
    }
}