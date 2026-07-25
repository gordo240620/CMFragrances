namespace CMFragrances.API.DTOs
{
    public class RegisterRequestDto
    {
        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Correo { get; set; } = string.Empty;

        public string? Telefono { get; set; }

        public string Password { get; set; } = string.Empty;
    }
}