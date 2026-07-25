namespace CMFragrances.API.Models
{
    public class Rol
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        // Relación uno a muchos
        public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}