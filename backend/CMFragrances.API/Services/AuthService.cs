using BCrypt.Net;
using CMFragrances.API.Data;
using CMFragrances.API.DTOs;
using CMFragrances.API.Helpers;
using CMFragrances.API.Interfaces;
using CMFragrances.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMFragrances.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // Verificar si el correo ya existe
            if (await _context.Usuarios.AnyAsync(u => u.Correo == request.Correo))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "El correo ya está registrado."
                };
            }

            // Buscar el rol Cliente
            var rolCliente = await _context.Roles
                .FirstOrDefaultAsync(r => r.Nombre == "Cliente");

            if (rolCliente == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "No existe el rol Cliente."
                };
            }

            // Crear el usuario
            var usuario = new Usuario
            {
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Correo = request.Correo,
                Telefono = request.Telefono,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Activo = true,
                FechaRegistro = DateTime.UtcNow,
                RolId = rolCliente.Id
            };

            // Guardar en la base de datos
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                Success = true,
                Message = "Usuario registrado correctamente."
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Buscar usuario por correo
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Correo == request.Correo);

            if (usuario == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Correo o contraseña incorrectos."
                };
            }

            // Verificar contraseña
            bool passwordValido = BCrypt.Net.BCrypt.Verify(
                request.Password,
                usuario.PasswordHash);

            if (!passwordValido)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Correo o contraseña incorrectos."
                };
            }

            // Generar JWT
            string token = _jwtHelper.GenerateToken(
                usuario.Id,
                usuario.Correo,
                usuario.Rol.Nombre);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Inicio de sesión exitoso.",
                Token = token
            };
        }
    }
}