using CMFragrances.API.Data;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Services
{
    public class PerfumeService : IPerfumeService
    {
        private readonly ApplicationDbContext _context;

        public PerfumeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Perfume>> ObtenerTodosAsync()
        {
            return await _context.Perfumes
                .Include(p => p.Categoria)
                .ToListAsync();
        }

        public async Task<Perfume?> ObtenerPorIdAsync(int id)
        {
            return await _context.Perfumes
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Perfume> CrearAsync(Perfume perfume)
        {
            _context.Perfumes.Add(perfume);
            await _context.SaveChangesAsync();

            return perfume;
        }

        public async Task<bool> ActualizarAsync(int id, Perfume perfume)
        {
            var existente = await _context.Perfumes.FindAsync(id);

            if (existente == null)
                return false;

            existente.Nombre = perfume.Nombre;
            existente.Marca = perfume.Marca;
            existente.Descripcion = perfume.Descripcion;
            existente.Concentracion = perfume.Concentracion;
            existente.ContenidoML = perfume.ContenidoML;
            existente.Precio = perfume.Precio;
            existente.Stock = perfume.Stock;
            existente.Imagen = perfume.Imagen;
            existente.Activo = perfume.Activo;
            existente.CategoriaId = perfume.CategoriaId;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var perfume = await _context.Perfumes.FindAsync(id);

            if (perfume == null)
                return false;

            _context.Perfumes.Remove(perfume);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}