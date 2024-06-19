using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using AuthService.Services.Email;
using AuthService.Services.SMS;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.EntityFrameworkCore;

namespace AuthService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "gestionRom", Version = "v1" });
            });
            services.AddSwaggerGen(option =>
            {
                option.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
                option.IgnoreObsoleteActions();
                option.IgnoreObsoleteProperties();
                option.CustomSchemaIds(type => type.FullName);
                option.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "Standard Authorization header using the bearer schema (\"bearer {token}\")",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
                option.OperationFilter<SecurityRequirementsOperationFilter>();
            });
            // Email
            services.AddScoped<IEmailService, EmailService>();
            // SMS
            services.AddScoped<ISMSService, SMSService>();
            // CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            });
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(option =>
                {
                    option.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            // DataBase
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<UserContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });
            
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "gestionRom v1"));
            }

            // Migrate on start up 
           
            
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization(); // This is necessary if you're using authorization
            app.UseCors("AllowAllOrigins");
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}