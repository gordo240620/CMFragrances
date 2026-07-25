namespace CMFragrances.API.Models
{
    public class Perfume
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Marca { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public string? Concentracion { get; set; }

        public int ContenidoML { get; set; }

        public decimal Precio { get; set; }

        public int Stock { get; set; }

        public string? Imagen { get; set; }

        public bool Activo { get; set; }

        public int CategoriaId { get; set; }

        public Categoria Categoria { get; set; } = null!;

        public ICollection<DetalleCarrito> DetalleCarritos { get; set; } = new List<DetalleCarrito>();

        public ICollection<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();
    }
}