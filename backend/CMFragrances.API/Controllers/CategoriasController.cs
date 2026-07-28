using CMFragrances.API.DTOs;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMFragrances.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService;

        public CategoriasController(ICategoriaService categoriaService)
        {
            _categoriaService = categoriaService;
        }

        // GET: api/Categorias
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var categorias = await _categoriaService.ObtenerTodasAsync();

            var resultado = categorias.Select(c => new CategoriaResponseDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion
            });

            return Ok(resultado);
        }

        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var categoria = await _categoriaService.ObtenerPorIdAsync(id);

            if (categoria == null)
                return NotFound();

            return Ok(categoria);
        }

        // POST: api/Categorias
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Crear(Categoria categoria)
        {
            var nuevaCategoria = await _categoriaService.CrearAsync(categoria);

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = nuevaCategoria.Id },
                nuevaCategoria);
        }

        // PUT: api/Categorias/5
        [Authorize(Roles = "Administrador")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, Categoria categoria)
        {
            var actualizado = await _categoriaService.ActualizarAsync(id, categoria);

            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/Categorias/5
        [Authorize()]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _categoriaService.EliminarAsync(id);

            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}