using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using AuthService;
public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureLogging(logging =>
            {
                logging.ClearProviders(); // Clear other logging providers to avoid duplication
                logging.AddConsole(); // Add console logging
            })
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}