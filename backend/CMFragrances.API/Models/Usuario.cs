namespace CMFragrances.API.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Correo { get; set; } = string.Empty;

        public string? Telefono { get; set; }

        public string PasswordHash { get; set; } = string.Empty;

        public bool Activo { get; set; }

        public DateTime FechaRegistro { get; set; }

        public int RolId { get; set; }

        public Rol Rol { get; set; } = null!;

        public ICollection<Carrito> Carritos { get; set; } = new List<Carrito>();

        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }
}