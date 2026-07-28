using CMFragrances.API.Data;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Services
{
    public class CarritoService : ICarritoService
    {
        private readonly ApplicationDbContext _context;

        public CarritoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Carrito>> ObtenerTodosAsync()
        {
            return await _context.Carritos
                .Include(c => c.Usuario)
                .Include(c => c.Detalles)
                .ToListAsync();
        }

        public async Task<Carrito?> ObtenerPorIdAsync(int id)
        {
            return await _context.Carritos
                .Include(c => c.Usuario)
                .Include(c => c.Detalles)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Carrito> CrearAsync(Carrito carrito)
        {
            carrito.FechaCreacion = DateTime.UtcNow;

            _context.Carritos.Add(carrito);

            await _context.SaveChangesAsync();

            return carrito;
        }

        public async Task<bool> ActualizarAsync(int id, Carrito carrito)
        {
            var existente = await _context.Carritos.FindAsync(id);

            if (existente == null)
                return false;

            existente.UsuarioId = carrito.UsuarioId;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var carrito = await _context.Carritos.FindAsync(id);

            if (carrito == null)
                return false;

            _context.Carritos.Remove(carrito);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}