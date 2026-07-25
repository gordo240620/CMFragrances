namespace CMFragrances.API.Models
{
    public class DetallePedido
    {
        public int Id { get; set; }

        public int PedidoId { get; set; }

        public int PerfumeId { get; set; }

        public int Cantidad { get; set; }

        public decimal Precio { get; set; }

        public Pedido Pedido { get; set; } = null!;

        public Perfume Perfume { get; set; } = null!;
    }
}