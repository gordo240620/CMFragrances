using CMFragrances.API.Data;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Services
{
    public class PedidoService : IPedidoService
    {
        private readonly ApplicationDbContext _context;

        public PedidoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pedido>> ObtenerTodosAsync()
        {
            return await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Detalles)
                .ToListAsync();
        }

        public async Task<Pedido?> ObtenerPorIdAsync(int id)
        {
            return await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Detalles)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Pedido> CrearAsync(Pedido pedido)
        {
            // Fecha automática en UTC
            pedido.FechaPedido = DateTime.UtcNow;

            _context.Pedidos.Add(pedido);

            await _context.SaveChangesAsync();

            return pedido;
        }

        public async Task<bool> ActualizarAsync(int id, Pedido pedido)
        {
            var existente = await _context.Pedidos.FindAsync(id);

            if (existente == null)
                return false;

            existente.UsuarioId = pedido.UsuarioId;
            existente.Total = pedido.Total;
            existente.Estado = pedido.Estado;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

            if (pedido == null)
                return false;

            _context.Pedidos.Remove(pedido);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}