using StockKeeperMail.Desktop.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;

namespace StockKeeperMail.Desktop.DAL
{
    /// <summary>
    /// Репозиторий, работающий через REST API.
    /// Для совместимости с существующими ViewModel фильтрация и сортировка выполняются на клиенте.
    /// </summary>
    public class GenericRepository<TEntity> where TEntity : class
    {
        private static readonly JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private readonly string _route;

        public GenericRepository()
        {
            _route = "api/" + ApiRouteMapper.GetRoute<TEntity>();
        }

        public virtual IEnumerable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "")
        {
            List<TEntity> items = ApiClientFactory.Client
                .GetFromJsonAsync<List<TEntity>>(_route, SerializerOptions)
                .GetAwaiter()
                .GetResult() ?? new List<TEntity>();

            IQueryable<TEntity> query = items.AsQueryable();

            if (filter != null)
            {
                query = query.Where(filter.Compile()).AsQueryable();
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }

            return query.ToList();
        }

        public virtual TEntity GetByID(object id)
        {
            List<TEntity> items = Get().ToList();
            return EntityKeyHelper.FindBySingleKey(items, id);
        }

        public virtual void Insert(TEntity entity)
        {
            HttpResponseMessage response = ApiClientFactory.Client.PostAsJsonAsync(_route, entity).GetAwaiter().GetResult();
            EnsureSuccess(response, "создание");
        }

        public virtual void Delete(object id)
        {
            TEntity entityToDelete = GetByID(id);
            if (entityToDelete != null)
            {
                Delete(entityToDelete);
            }
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            HttpResponseMessage response = ApiClientFactory.Client.PostAsJsonAsync($"{_route}/delete", entityToDelete).GetAwaiter().GetResult();
            EnsureSuccess(response, "удаление");
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            HttpResponseMessage response = ApiClientFactory.Client.PutAsJsonAsync(_route, entityToUpdate).GetAwaiter().GetResult();
            EnsureSuccess(response, "обновление");
        }

        private static void EnsureSuccess(HttpResponseMessage response, string operationName)
        {
            if (response.IsSuccessStatusCode)
            {
                return;
            }

            string responseText = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            throw new InvalidOperationException($"API вернул ошибку при выполнении операции '{operationName}': {(int)response.StatusCode} {response.ReasonPhrase}. {responseText}");
        }
    }
}
