using SpaceDuck.Common.Models;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.DataBase.Repositories
{
    public interface IRankingRepository
    {
        IQueryable<Ranking> Rankings { get; }
        Task SaveRanking(Ranking ranking);
        void DeleteRanking(string playerId);
    }

    public class RankingRepository : IRankingRepository
    {
        private ApplicationDataDbContext context;

        public RankingRepository(ApplicationDataDbContext dataContext)
        {
            context = dataContext;
        }

        public IQueryable<Ranking> Rankings => context.Rankings;

        public void DeleteRanking(string playerId)
        {
            var dbEntries = context.Rankings
                .Where(ranking => ranking.UserId == playerId);

            foreach (var entity in dbEntries)
            {
                if (entity != null)
                {
                    context.Rankings.Remove(entity);
                }
            }

            context.SaveChanges();
        }

        public async Task SaveRanking(Ranking ranking)
        {
            if (ranking.Id == 0)
            {
                await context.AddAsync(ranking);
            }
            else
            {
                context.Entry(ranking).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            }

            await context.SaveChangesAsync();
        }
    }
}
