namespace CMFragrances.API.DTOs
{
    public class DetallePedidoRequestDto
    {
        public int PedidoId { get; set; }

        public int PerfumeId { get; set; }

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }
    }
}