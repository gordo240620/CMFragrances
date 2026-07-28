namespace CMFragrances.API.DTOs
{
    public class PedidoRequestDto
    {
        public int UsuarioId { get; set; }

        public decimal Total { get; set; }

        public string Estado { get; set; } = string.Empty;
    }
}