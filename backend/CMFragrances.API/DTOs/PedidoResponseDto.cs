namespace CMFragrances.API.DTOs
{
    public class PedidoResponseDto
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public string Usuario { get; set; } = string.Empty;

        public DateTime FechaPedido { get; set; }

        public decimal Total { get; set; }

        public string Estado { get; set; } = string.Empty;
    }
}