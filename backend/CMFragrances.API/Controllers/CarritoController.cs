using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using CMFragrances.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMFragrances.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoService _carritoService;

        public CarritoController(ICarritoService carritoService)
        {
            _carritoService = carritoService;
        }

        // GET: api/Carrito
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var carritos = await _carritoService.ObtenerTodosAsync();

            var resultado = carritos.Select(c => new CarritoResponseDto
            {
                Id = c.Id,
                UsuarioId = c.UsuarioId,
                Usuario = $"{c.Usuario?.Nombre} {c.Usuario?.Apellido}",
                FechaCreacion = c.FechaCreacion
            });

            return Ok(resultado);
        }

        // GET: api/Carrito/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var carrito = await _carritoService.ObtenerPorIdAsync(id);

            if (carrito == null)
                return NotFound();

            return Ok(carrito);
        }

        // POST: api/Carrito
        [HttpPost]
        public async Task<IActionResult> Crear(CarritoRequestDto dto)
        {
            var carrito = new Carrito
            {
                UsuarioId = dto.UsuarioId
            };

            var nuevoCarrito = await _carritoService.CrearAsync(carrito);

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = nuevoCarrito.Id },
                nuevoCarrito);
        }

        // PUT: api/Carrito/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, CarritoRequestDto dto)
        {
            var carrito = new Carrito
            {
                UsuarioId = dto.UsuarioId
            };

            var actualizado = await _carritoService.ActualizarAsync(id, carrito);

            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/Carrito/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _carritoService.EliminarAsync(id);

            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}