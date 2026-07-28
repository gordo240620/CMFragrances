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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ROLES
            modelBuilder.Entity<Rol>(entity =>
            {
                entity.ToTable("roles");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("id");

                entity.Property(e => e.Nombre)
                    .HasColumnName("nombre");

                entity.HasMany(e => e.Usuarios)
                    .WithOne(e => e.Rol)
                    .HasForeignKey(e => e.RolId);
            });

            // USUARIOS
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuarios");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.Nombre).HasColumnName("Nombre");
                entity.Property(e => e.Apellido).HasColumnName("Apellido");
                entity.Property(e => e.Correo).HasColumnName("Correo");
                entity.Property(e => e.Telefono).HasColumnName("Telefono");
                entity.Property(e => e.PasswordHash).HasColumnName("PasswordHash");
                entity.Property(e => e.Activo).HasColumnName("Activo");
                entity.Property(e => e.FechaRegistro).HasColumnName("FechaRegistro");
                entity.Property(e => e.RolId).HasColumnName("RolId");
            });

            // CATEGORIAS
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("categorias");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.Nombre).HasColumnName("Nombre");
                entity.Property(e => e.Descripcion).HasColumnName("Descripcion");
            });

            // PERFUMES
            modelBuilder.Entity<Perfume>(entity =>
            {
                entity.ToTable("perfumes");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.Nombre).HasColumnName("Nombre");
                entity.Property(e => e.Marca).HasColumnName("Marca");
                entity.Property(e => e.Descripcion).HasColumnName("Descripcion");
                entity.Property(e => e.Concentracion).HasColumnName("Concentracion");
                entity.Property(e => e.ContenidoML).HasColumnName("ContenidoML");
                entity.Property(e => e.Precio).HasColumnName("Precio");
                entity.Property(e => e.Stock).HasColumnName("Stock");
                entity.Property(e => e.Imagen).HasColumnName("Imagen");
                entity.Property(e => e.Activo).HasColumnName("Activo");
                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaId");
            });

            // CARRITO
            modelBuilder.Entity<Carrito>(entity =>
            {
                entity.ToTable("carrito");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioId");
                entity.Property(e => e.FechaCreacion).HasColumnName("FechaCreacion");
            });

            // DETALLE CARRITO
            modelBuilder.Entity<DetalleCarrito>(entity =>
            {
                entity.ToTable("detallecarrito");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.CarritoId).HasColumnName("CarritoId");
                entity.Property(e => e.PerfumeId).HasColumnName("PerfumeId");
                entity.Property(e => e.Cantidad).HasColumnName("Cantidad");
                entity.Property(e => e.Precio).HasColumnName("Precio");
            });

            // PEDIDOS
            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.ToTable("pedidos");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioId");
                entity.Property(e => e.FechaPedido).HasColumnName("FechaPedido");
                entity.Property(e => e.Total).HasColumnName("Total");
                entity.Property(e => e.Estado).HasColumnName("Estado");
            });

            // DETALLE PEDIDOS
            modelBuilder.Entity<DetallePedido>(entity =>
            {
                entity.ToTable("detallepedido");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.PedidoId).HasColumnName("PedidoId");
                entity.Property(e => e.PerfumeId).HasColumnName("PerfumeId");
                entity.Property(e => e.Cantidad).HasColumnName("Cantidad");
                entity.Property(e => e.Precio).HasColumnName("Precio");
            });
        }
    }
}