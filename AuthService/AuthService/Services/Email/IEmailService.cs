using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http.HttpResults;
using MimeKit;

namespace AuthService.Services.Email;

public interface IEmailService
{
    void SendEmail(string receiverMail, string body)
    {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("XSpace", "echberaalmail@gmail.com"));
            message.To.Add(new MailboxAddress("XSpace", receiverMail));
            message.Subject = "Reset your Password";

            message.Body = new TextPart("plain")
            {
                Text = body
            };


            using (var client = new SmtpClient())
            {
                client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate("echberaalmail@gmail.com", "rbfz prpy zmam gnmb");
                client.Send(message);
                client.Disconnect(true);
            }
        
    }
}