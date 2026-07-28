using CMFragrances.API.Data;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly ApplicationDbContext _context;

        public CategoriaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Categoria>> ObtenerTodasAsync()
        {
            return await _context.Categorias.ToListAsync();
        }

        public async Task<Categoria?> ObtenerPorIdAsync(int id)
        {
            return await _context.Categorias.FindAsync(id);
        }

        public async Task<Categoria> CrearAsync(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return categoria;
        }

        public async Task<bool> ActualizarAsync(int id, Categoria categoria)
        {
            var existente = await _context.Categorias.FindAsync(id);

            if (existente == null)
                return false;

            existente.Nombre = categoria.Nombre;
            existente.Descripcion = categoria.Descripcion;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
                return false;

            _context.Categorias.Remove(categoria);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}