using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using CMFragrances.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMFragrances.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerfumesController : ControllerBase
    {
        private readonly IPerfumeService _perfumeService;

        public PerfumesController(IPerfumeService perfumeService)
        {
            _perfumeService = perfumeService;
        }

        // GET: api/Perfumes
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var perfumes = await _perfumeService.ObtenerTodosAsync();

            var resultado = perfumes.Select(p => new PerfumeResponseDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Marca = p.Marca,
                Descripcion = p.Descripcion,
                Concentracion = p.Concentracion,
                ContenidoML = p.ContenidoML,
                Precio = p.Precio,
                Stock = p.Stock,
                Imagen = p.Imagen,
                Activo = p.Activo,
                CategoriaId = p.CategoriaId,
                Categoria = p.Categoria?.Nombre ?? ""
            });

            return Ok(resultado);
        }

        // GET: api/Perfumes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var perfume = await _perfumeService.ObtenerPorIdAsync(id);

            if (perfume == null)
                return NotFound();

            return Ok(perfume);
        }

        // POST: api/Perfumes
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Crear(PerfumeRequestDto dto)
        {
            var perfume = new Perfume
            {
                Nombre = dto.Nombre,
                Marca = dto.Marca,
                Descripcion = dto.Descripcion,
                Concentracion = dto.Concentracion,
                ContenidoML = dto.ContenidoML,
                Precio = dto.Precio,
                Stock = dto.Stock,
                Imagen = dto.Imagen,
                Activo = dto.Activo,
                CategoriaId = dto.CategoriaId
            };

            var nuevoPerfume = await _perfumeService.CrearAsync(perfume);

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = nuevoPerfume.Id },
                nuevoPerfume);
        }

        // PUT: api/Perfumes/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, PerfumeRequestDto dto)
        {
            var perfume = new Perfume
            {
                Nombre = dto.Nombre,
                Marca = dto.Marca,
                Descripcion = dto.Descripcion,
                Concentracion = dto.Concentracion,
                ContenidoML = dto.ContenidoML,
                Precio = dto.Precio,
                Stock = dto.Stock,
                Imagen = dto.Imagen,
                Activo = dto.Activo,
                CategoriaId = dto.CategoriaId
            };

            var actualizado = await _perfumeService.ActualizarAsync(id, perfume);

            if (!actualizado)
                return NotFound();

            return NoContent();
        }
        // DELETE: api/Perfumes/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _perfumeService.EliminarAsync(id);

            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}