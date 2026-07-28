using CMFragrances.API.DTOs;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMFragrances.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DetalleCarritoController : ControllerBase
    {
        private readonly IDetalleCarritoService _detalleCarritoService;

        public DetalleCarritoController(IDetalleCarritoService detalleCarritoService)
        {
            _detalleCarritoService = detalleCarritoService;
        }

        // GET: api/DetalleCarrito
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var detalles = await _detalleCarritoService.ObtenerTodosAsync();

            var resultado = detalles.Select(d => new DetalleCarritoResponseDto
            {
                Id = d.Id,
                CarritoId = d.CarritoId,
                PerfumeId = d.PerfumeId,
                Perfume = d.Perfume?.Nombre ?? "",
                Cantidad = d.Cantidad,
                Precio = d.Precio
            });

            return Ok(resultado);
        }

        // GET: api/DetalleCarrito/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var detalle = await _detalleCarritoService.ObtenerPorIdAsync(id);

            if (detalle == null)
                return NotFound();

            return Ok(detalle);
        }

        // POST: api/DetalleCarrito
        [HttpPost]
        public async Task<IActionResult> Crear(DetalleCarritoRequestDto dto)
        {
            var detalle = new DetalleCarrito
            {
                CarritoId = dto.CarritoId,
                PerfumeId = dto.PerfumeId,
                Cantidad = dto.Cantidad,
                Precio = dto.Precio
            };

            var nuevoDetalle = await _detalleCarritoService.CrearAsync(detalle);

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = nuevoDetalle.Id },
                nuevoDetalle);
        }

        // PUT: api/DetalleCarrito/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, DetalleCarritoRequestDto dto)
        {
            var detalle = new DetalleCarrito
            {
                CarritoId = dto.CarritoId,
                PerfumeId = dto.PerfumeId,
                Cantidad = dto.Cantidad,
                Precio = dto.Precio
            };

            var actualizado = await _detalleCarritoService.ActualizarAsync(id, detalle);

            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/DetalleCarrito/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _detalleCarritoService.EliminarAsync(id);

            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}