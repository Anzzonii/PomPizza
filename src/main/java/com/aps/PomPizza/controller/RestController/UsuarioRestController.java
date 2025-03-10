package com.aps.PomPizza.controller.RestController;

import com.aps.PomPizza.models.AuthRequest;
import com.aps.PomPizza.models.Usuario;
import com.aps.PomPizza.repository.UsuarioRepository;
import com.aps.PomPizza.service.security.UserInfoService;
import com.aps.PomPizza.service.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class UsuarioRestController {

    @Autowired
    private UserInfoService service;

    private UsuarioRepository usuarioRepository;

    public UsuarioRestController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }


    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/users")
    public List<Usuario> allUsers(){
        return usuarioRepository.findAll();
    }

    @PostMapping("/addNewUser")
    public String addNewUser(@RequestBody Usuario userInfo) {
        return service.addUser(userInfo);
    }

    // Endpoint para generar ambos tokens al autenticarse
    @PostMapping("/generateToken")
    public ResponseEntity<Map<String, String>> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        if (authentication.isAuthenticated()) {
            UserDetails userDetails = service.loadUserByUsername(authRequest.getUsername());
            String accessToken = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);
            return ResponseEntity.ok(tokens);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // Endpoint para refrescar el access token usando el refresh token
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(null);
        }
        try {
            // Extraemos el username del refresh token
            String username = jwtService.extractUsername(refreshToken);
            UserDetails userDetails = service.loadUserByUsername(username);
            // Validamos el refresh token (esto comprueba su expiración)
            if (!jwtService.validateToken(refreshToken, userDetails)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            String newAccessToken = jwtService.generateToken(userDetails);
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            return ResponseEntity.ok(response);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // El refresh token ha expirado
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}