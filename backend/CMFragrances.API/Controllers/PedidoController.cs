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
    public class PedidoController : ControllerBase
    {
        private readonly IPedidoService _pedidoService;

        public PedidoController(IPedidoService pedidoService)
        {
            _pedidoService = pedidoService;
        }

        // GET: api/Pedido
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var pedidos = await _pedidoService.ObtenerTodosAsync();

            var resultado = pedidos.Select(p => new PedidoResponseDto
            {
                Id = p.Id,
                UsuarioId = p.UsuarioId,
                Usuario = $"{p.Usuario?.Nombre} {p.Usuario?.Apellido}",
                FechaPedido = p.FechaPedido,
                Total = p.Total,
                Estado = p.Estado
            });

            return Ok(resultado);
        }

        // GET: api/Pedido/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var pedido = await _pedidoService.ObtenerPorIdAsync(id);

            if (pedido == null)
                return NotFound();

            return Ok(pedido);
        }

        // POST: api/Pedido
        [HttpPost]
        public async Task<IActionResult> Crear(PedidoRequestDto dto)
        {
            var pedido = new Pedido
            {
                UsuarioId = dto.UsuarioId,
                Total = dto.Total,
                Estado = dto.Estado
            };

            var nuevoPedido = await _pedidoService.CrearAsync(pedido);

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = nuevoPedido.Id },
                nuevoPedido);
        }

        // PUT: api/Pedido/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, PedidoRequestDto dto)
        {
            var pedido = new Pedido
            {
                UsuarioId = dto.UsuarioId,
                Total = dto.Total,
                Estado = dto.Estado
            };

            var actualizado = await _pedidoService.ActualizarAsync(id, pedido);

            if (!actualizado)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/Pedido/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _pedidoService.EliminarAsync(id);

            if (!eliminado)
                return NotFound();

            return NoContent();
        }
    }
}