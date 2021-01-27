using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SpaceDuck.ShipsGame.DataBase;
using SpaceDuck.ShipsGame.DataBase.Repositories;
using SpaceDuck.ShipsGame.Hubs;
using SpaceDuck.ShipsGame.Server;
using SpaceDuck.ShipsGame.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpaceDuck.ShipsGame
{
    class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                    .AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore); ;

            services.AddSignalR(o =>
            {
                o.EnableDetailedErrors = true;
                o.ClientTimeoutInterval = new System.TimeSpan(0, 1, 0);
                o.MaximumReceiveMessageSize = 1048576; // 1MB
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.WithOrigins("http://localhost:3000", "https://localhost:44305", "http://localhost:3060")
                    .AllowAnyMethod()
                    .AllowAnyHeader().AllowCredentials());
            });

            services.AddDbContext<ApplicationDataDbContext>(options => options.UseMySql(Configuration["Data:ApplicationDataMySql:ConnectionString"]), ServiceLifetime.Transient, ServiceLifetime.Transient);

            services.AddSingleton<IGameServer, GameServer>();

            services.AddTransient<IRankingRepository, RankingRepository>();
            services.AddTransient<IRoomRepository, RoomRepository>();

            services.AddTransient<IRankingService, RankingService>();
            services.AddTransient<IRoomService, RoomService>();
            services.AddTransient<IShipsService, ShipsService>();

            services.AddSingleton<IGameMiddleware, GameMiddleware>();
            services.AddSingleton<IGameHelper, GameHelper>();

            services.AddSingleton<IShipsHub, ShipsHub>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ShipsHub>("/shipsHub");
            });
        }

    }
}
