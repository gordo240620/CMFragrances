namespace CMFragrances.API.DTOs
{
    public class DetallePedidoResponseDto
    {
        public int Id { get; set; }

        public int PedidoId { get; set; }

        public int PerfumeId { get; set; }

        public string Perfume { get; set; } = string.Empty;

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }
    }
}