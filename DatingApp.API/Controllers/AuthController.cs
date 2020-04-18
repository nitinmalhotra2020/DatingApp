using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
  [Route("api/[controller]")]
    [ApiController]
   public class AuthController :ControllerBase
    {
        private readonly IAuthRepository _repo;
           private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config=config;
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto registerDto)
        {
            // validate request
            registerDto.Username = registerDto.Username.ToLower();

            if(await _repo.UserExists(registerDto.Username))
            return BadRequest("Username Already Exists");
            
            var userToCreate = new User{
                Username = registerDto.Username
            };

            var createdUser = await _repo.Register(userToCreate,registerDto.Password);
             return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login (UserForLoginDto userForLoginDto)
        {
            // Check if the user details entered by user exists in our system
            var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(),userForLoginDto.Password);

            if(userFromRepo == null)
                return Unauthorized();

            // JWT Token will have 2 claims:
            // User Id and User Name
                var claims = new[]
                {
                    new Claim(
                        ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                    new Claim(
                        ClaimTypes.Name, userFromRepo.Username)
                };

                // To identify if the token reaching back the server is a valid token , we need to sign the token.
                // So we create a Symmetric Security key for Signing purpose

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
                        (_config.GetSection("AppSettings:Token").Value));

                // Use Key as part of the Signning Credentials
                // Setup Signing Credetials and Encrypt the key using HmacSha512Signature
                var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

                // Token Creation:
                // Create a token Descriptor by:
                // Passing our claims andas Subject , Give an Expiry date adnd assign the Signing Credentials
                var tokenDescriptor = new SecurityTokenDescriptor{
                    Subject = new ClaimsIdentity(claims), 
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };

                // Create a JWTTokenHandler
                var tokenhHandler = new JwtSecurityTokenHandler();
                
                // using the tokenHandler Create a token based on the token Descriptor being passed for above
                var token = tokenhHandler.CreateToken(tokenDescriptor);

                // Write the token in the response using the token variable
            return Ok(new {
                token = tokenhHandler.WriteToken(token)
            });
        }
    }
}