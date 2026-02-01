using araby.Helpers;
using araby.Models;
using System.Net;
using System.Text.Json;

namespace araby.Middleware
{
    /// <summary>
    /// Global exception handler middleware
    /// </summary>
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;

        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var egyptTime = TimeZoneHelper.GetEgyptTime();
            
            // Log the exception with Egypt timestamp
            _logger.LogError(exception, 
                "An error occurred at {EgyptTime} (Egypt Standard Time): {Message}", 
                egyptTime, 
                exception.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = ApiResponse<object>.ErrorResponse(
                "An error occurred while processing your request.",
                new List<string> 
                { 
                    exception.Message,
                    $"Timestamp: {egyptTime:yyyy-MM-dd HH:mm:ss} (Egypt Standard Time)"
                }
            );

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, options);
            await context.Response.WriteAsync(json);
        }
    }

    /// <summary>
    /// Extension method to register the exception handler middleware
    /// </summary>
    public static class ExceptionHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlerMiddleware>();
        }
    }
}
