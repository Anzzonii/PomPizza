package com.aps.PomPizza.service.security;


import com.aps.PomPizza.models.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserInfoDetails implements UserDetails {

    private String username;
    private String password;
    private List<GrantedAuthority> authorities;

    public UserInfoDetails(Usuario userInfo) {
        this.username = userInfo.getName(); // Suponiendo que 'name' es el nombre de usuario
        this.password = userInfo.getPassword();
        // Convertir el rol a GrantedAuthority
        this.authorities = List.of(new SimpleGrantedAuthority(userInfo.getRol())); // Asumiendo que getRol() devuelve el rol como 'ROLE_USER' o 'ROLE_ADMIN'
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}