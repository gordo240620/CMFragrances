using CMFragrances.API.Models;

namespace CMFragrances.API.Interfaces
{
    public interface ICarritoService
    {
        Task<IEnumerable<Carrito>> ObtenerTodosAsync();

        Task<Carrito?> ObtenerPorIdAsync(int id);

        Task<Carrito> CrearAsync(Carrito carrito);

        Task<bool> ActualizarAsync(int id, Carrito carrito);

        Task<bool> EliminarAsync(int id);
    }
}