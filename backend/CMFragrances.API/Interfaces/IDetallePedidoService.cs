using CMFragrances.API.Models;

namespace CMFragrances.API.Interfaces
{
    public interface IDetallePedidoService
    {
        Task<IEnumerable<DetallePedido>> ObtenerTodosAsync();

        Task<DetallePedido?> ObtenerPorIdAsync(int id);

        Task<DetallePedido> CrearAsync(DetallePedido detalle);

        Task<bool> ActualizarAsync(int id, DetallePedido detalle);

        Task<bool> EliminarAsync(int id);
    }
}
