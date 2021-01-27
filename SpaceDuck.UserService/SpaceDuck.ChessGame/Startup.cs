using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SpaceDuck.ChessGame.DataBase;
using SpaceDuck.ChessGame.DataBase.Repositories;
using SpaceDuck.ChessGame.Hubs;
using SpaceDuck.ChessGame.Server;
using SpaceDuck.ChessGame.Services;

namespace SpaceDuck.ChessGame
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
            services.AddControllers().AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore); ;

            services.AddSignalR(o =>
            {
                o.EnableDetailedErrors = true;
                o.ClientTimeoutInterval = new System.TimeSpan(0, 1, 0);
                o.MaximumReceiveMessageSize = 1048576; // 1MB
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.SetIsOriginAllowed(_ => true)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.AddDbContext<ApplicationDataDbContext>(options => options.UseMySql(Configuration["Data:ApplicationDataMySql:ConnectionString"]), ServiceLifetime.Transient, ServiceLifetime.Transient);

            services.AddSingleton<IGameServer, GameServer>();

            services.AddTransient<IRankingRepository, RankingRepository>();
            services.AddTransient<IRoomRepository, RoomRepository>();

            services.AddTransient<IRankingService, RankingService>();
            services.AddTransient<IRoomService, RoomService>();
            services.AddTransient<IChessService, ChessService>();

            services.AddSingleton<IGameMiddleware, GameMiddleware>();
            services.AddSingleton<IGameHelper, GameHelper>();

            services.AddSingleton<IChessHub, ChessHub>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChessHub>("/chessHub");
            });
        }
    }
}