using CMFragrances.API.Models;

namespace CMFragrances.API.Interfaces
{
    public interface ICategoriaService
    {
        Task<IEnumerable<Categoria>> ObtenerTodasAsync();

        Task<Categoria?> ObtenerPorIdAsync(int id);

        Task<Categoria> CrearAsync(Categoria categoria);

        Task<bool> ActualizarAsync(int id, Categoria categoria);

        Task<bool> EliminarAsync(int id);
    }
}