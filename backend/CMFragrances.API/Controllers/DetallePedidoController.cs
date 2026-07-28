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
    public class DetallePedidoController : ControllerBase
    {
        private readonly IDetallePedidoService _detallePedidoService;

        public DetallePedidoController(IDetallePedidoService detallePedidoService)
        {
            _detallePedidoService = detallePedidoService;
        }

        // GET: api/DetallePedido
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var detalles = await _detallePedidoService.ObtenerTodosAsync();

            var resultado = detalles.Select(d => new DetallePedidoResponseDto
            {
                Id = d.Id,
                PedidoId = d.PedidoId,
                PerfumeId = d.PerfumeId,
                Perfume = d.Perfume?.Nombre ?? "",
                Cantidad = d.Cantidad,
                Precio = d.Precio
            });

            return Ok(resultado);
        }

        // GET: api/DetallePedido/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var detalle = await _detallePedidoService.ObtenerPorIdAsync(id);

            if (detalle == null)
                return NotFound();

            return Ok(detalle);
        }

        // POST: api/DetallePedido
        [HttpPost]
        public async Task<IActionResult> Crear(DetallePedidoRequestDto dto)
        {
            var detalle = new DetallePedido
            {
                PedidoId = dto.PedidoId,
                PerfumeId = dto.PerfumeId,
                Cantidad = dto.Cantidad,
                Precio = dto.Precio
            };

            var nuevoDetalle = await _detallePedidoService.CrearAsync(detalle);

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = nuevoDetalle.Id },
                nuevoDetalle);
        }

        // PUT: api/DetallePedido/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, DetallePedidoRequestDto dto)
        {
            var detalle = new DetallePedido
            {
                PedidoId = dto.PedidoId,
                PerfumeId = dto.PerfumeId,
                Cantidad = dto.Cantidad,
                Precio = dto.Precio
            };

            var actualizado = await _detallePedidoService.ActualizarAsync(id, detalle);

            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/DetallePedido/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _detallePedidoService.EliminarAsync(id);

            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}