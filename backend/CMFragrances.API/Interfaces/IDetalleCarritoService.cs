using CMFragrances.API.Models;

namespace CMFragrances.API.Interfaces
{
    public interface IDetalleCarritoService
    {
        Task<IEnumerable<DetalleCarrito>> ObtenerTodosAsync();

        Task<DetalleCarrito?> ObtenerPorIdAsync(int id);

        Task<DetalleCarrito> CrearAsync(DetalleCarrito detalle);

        Task<bool> ActualizarAsync(int id, DetalleCarrito detalle);

        Task<bool> EliminarAsync(int id);
    }
}