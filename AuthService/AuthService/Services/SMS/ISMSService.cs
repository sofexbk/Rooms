using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http.HttpResults;
using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System;
using MailKit.Security;
using AuthService.Services.Email;
using Twilio;
using Twilio.Types;
using Twilio.Rest.Api.V2010;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Rest.Insights.V1;
using Infobip;
using Infobip.Api.Client;
using RestSharp;

namespace AuthService.Services.Email;

public interface ISMSService
{
    public async void SendSMS(string phoneNumber, string message)
    {
        var options = new RestClientOptions("https://k2v533.api.infobip.com")
        {
            MaxTimeout = -1,
        };
        var client = new RestClient(options);
        var request = new RestRequest("/sms/2/text/advanced", Method.Post);
        request.AddHeader("Authorization", "App c8cee227e4442d715982ae3bbec38279-ec269c9f-e4d5-44e0-b8d3-a681de2a9c94");
        request.AddHeader("Content-Type", "application/json");
        request.AddHeader("Accept", "application/json");
        var jsonBody = new
        {
            messages = new[]
            {
                new
                {
                    destinations = new[]
                    {
                        new
                        {
                            to = phoneNumber
                        }
                    },
                    from = "ServiceXSpace",
                    text = message
                }
            }
        };
        request.AddJsonBody(jsonBody);
        RestResponse response = await client.ExecuteAsync(request);
        
    }
}