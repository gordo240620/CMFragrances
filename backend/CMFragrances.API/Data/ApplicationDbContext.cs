using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Rol> Roles { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Perfume> Perfumes { get; set; }

        public DbSet<Carrito> Carritos { get; set; }

        public DbSet<DetalleCarrito> DetalleCarritos { get; set; }

        public DbSet<Pedido> Pedidos { get; set; }

        public DbSet<DetallePedido> DetallePedidos { get; set; }
    }
}