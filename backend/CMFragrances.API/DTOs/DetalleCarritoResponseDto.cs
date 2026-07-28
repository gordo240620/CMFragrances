namespace CMFragrances.API.DTOs
{
    public class DetalleCarritoResponseDto
    {
        public int Id { get; set; }

        public int CarritoId { get; set; }

        public int PerfumeId { get; set; }

        public string Perfume { get; set; } = string.Empty;

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }
    }
}