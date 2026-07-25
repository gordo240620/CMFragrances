namespace CMFragrances.API.Models
{
    public class DetalleCarrito
    {
        public int Id { get; set; }

        public int CarritoId { get; set; }

        public int PerfumeId { get; set; }

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }

        public Carrito Carrito { get; set; } = null!;

        public Perfume Perfume { get; set; } = null!;
    }
}