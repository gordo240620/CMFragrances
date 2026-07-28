namespace CMFragrances.API.DTOs
{
    public class DetalleCarritoRequestDto
    {
        public int CarritoId { get; set; }

        public int PerfumeId { get; set; }

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }
    }
}