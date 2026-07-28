using CMFragrances.API.Data;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Services
{
    public class DetalleCarritoService : IDetalleCarritoService
    {
        private readonly ApplicationDbContext _context;

        public DetalleCarritoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DetalleCarrito>> ObtenerTodosAsync()
        {
            return await _context.DetalleCarritos
                .Include(d => d.Carrito)
                .Include(d => d.Perfume)
                .ToListAsync();
        }

        public async Task<DetalleCarrito?> ObtenerPorIdAsync(int id)
        {
            return await _context.DetalleCarritos
                .Include(d => d.Carrito)
                .Include(d => d.Perfume)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<DetalleCarrito> CrearAsync(DetalleCarrito detalle)
        {
            _context.DetalleCarritos.Add(detalle);

            await _context.SaveChangesAsync();

            return detalle;
        }

        public async Task<bool> ActualizarAsync(int id, DetalleCarrito detalle)
        {
            var existente = await _context.DetalleCarritos.FindAsync(id);

            if (existente == null)
                return false;

            existente.CarritoId = detalle.CarritoId;
            existente.PerfumeId = detalle.PerfumeId;
            existente.Cantidad = detalle.Cantidad;
            existente.Precio = detalle.Precio;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var detalle = await _context.DetalleCarritos.FindAsync(id);

            if (detalle == null)
                return false;

            _context.DetalleCarritos.Remove(detalle);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}