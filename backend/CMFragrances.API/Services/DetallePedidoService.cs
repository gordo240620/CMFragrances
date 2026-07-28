using CMFragrances.API.Data;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Services
{
    public class DetallePedidoService : IDetallePedidoService
    {
        private readonly ApplicationDbContext _context;

        public DetallePedidoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DetallePedido>> ObtenerTodosAsync()
        {
            return await _context.DetallePedidos
                .Include(d => d.Pedido)
                .Include(d => d.Perfume)
                .ToListAsync();
        }

        public async Task<DetallePedido?> ObtenerPorIdAsync(int id)
        {
            return await _context.DetallePedidos
                .Include(d => d.Pedido)
                .Include(d => d.Perfume)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<DetallePedido> CrearAsync(DetallePedido detalle)
        {
            _context.DetallePedidos.Add(detalle);

            await _context.SaveChangesAsync();

            return detalle;
        }

        public async Task<bool> ActualizarAsync(int id, DetallePedido detalle)
        {
            var existente = await _context.DetallePedidos.FindAsync(id);

            if (existente == null)
                return false;

            existente.PedidoId = detalle.PedidoId;
            existente.PerfumeId = detalle.PerfumeId;
            existente.Cantidad = detalle.Cantidad;
            existente.Precio = detalle.Precio;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var detalle = await _context.DetallePedidos.FindAsync(id);

            if (detalle == null)
                return false;

            _context.DetallePedidos.Remove(detalle);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}