package com.aps.PomPizza.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.GrantedAuthority;

import java.util.stream.Collectors;

@Controller
@RequestMapping("/auth")
public class LoginController {
    // Endpoint para la página de login
    @GetMapping("/login")
    public String showLoginPage() {
        return "login"; // Este es el nombre de la vista (login.html)
    }

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }


}
