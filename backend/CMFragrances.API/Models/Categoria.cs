namespace CMFragrances.API.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public ICollection<Perfume> Perfumes { get; set; } = new List<Perfume>();
    }
}