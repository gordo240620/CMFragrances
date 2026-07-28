using CMFragrances.API.Models;

namespace CMFragrances.API.Interfaces
{
    public interface IPedidoService
    {
        Task<IEnumerable<Pedido>> ObtenerTodosAsync();

        Task<Pedido?> ObtenerPorIdAsync(int id);

        Task<Pedido> CrearAsync(Pedido pedido);

        Task<bool> ActualizarAsync(int id, Pedido pedido);

        Task<bool> EliminarAsync(int id);
    }
}