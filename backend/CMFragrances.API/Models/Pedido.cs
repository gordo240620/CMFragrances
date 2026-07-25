namespace CMFragrances.API.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public DateTime FechaPedido { get; set; }

        public decimal Total { get; set; }

        public string Estado { get; set; } = string.Empty;

        public Usuario Usuario { get; set; } = null!;

        public ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
    }
}