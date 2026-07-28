namespace CMFragrances.API.DTOs
{
    public class PerfumeRequestDto
    {
        public string Nombre { get; set; } = string.Empty;

        public string Marca { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public string? Concentracion { get; set; }

        public int ContenidoML { get; set; }

        public decimal Precio { get; set; }

        public int Stock { get; set; }

        public string? Imagen { get; set; }

        public bool Activo { get; set; }

        public int CategoriaId { get; set; }
    }
}