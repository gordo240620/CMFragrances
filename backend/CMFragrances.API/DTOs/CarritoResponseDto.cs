namespace CMFragrances.API.DTOs
{
    public class CarritoResponseDto
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public string Usuario { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; }
    }
}