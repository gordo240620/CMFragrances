namespace CMFragrances.API.DTOs
{
    public class PerfumeResponseDto
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Marca { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public string Concentracion { get; set; } = string.Empty;

        public int ContenidoML { get; set; }

        public decimal Precio { get; set; }

        public int Stock { get; set; }

        public string Imagen { get; set; } = string.Empty;

        public bool Activo { get; set; }

        public int CategoriaId { get; set; }

        public string Categoria { get; set; } = string.Empty;
    }
}