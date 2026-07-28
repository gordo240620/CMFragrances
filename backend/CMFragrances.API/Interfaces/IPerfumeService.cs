using CMFragrances.API.Models;

namespace CMFragrances.API.Interfaces
{
    public interface IPerfumeService
    {
        Task<IEnumerable<Perfume>> ObtenerTodosAsync();

        Task<Perfume?> ObtenerPorIdAsync(int id);

        Task<Perfume> CrearAsync(Perfume perfume);

        Task<bool> ActualizarAsync(int id, Perfume perfume);

        Task<bool> EliminarAsync(int id);
    }
}