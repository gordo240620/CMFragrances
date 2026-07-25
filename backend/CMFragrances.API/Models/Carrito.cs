namespace CMFragrances.API.Models
{
    public class Carrito
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public DateTime FechaCreacion { get; set; }

        public Usuario Usuario { get; set; } = null!;

        public ICollection<DetalleCarrito> Detalles { get; set; } = new List<DetalleCarrito>();
    }
}