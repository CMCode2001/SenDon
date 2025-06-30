package com.blooddonation.service;

import com.blooddonation.dto.AuthResponseDto;
import com.blooddonation.dto.LoginDto;
import com.blooddonation.dto.UserRegistrationDto;
import com.blooddonation.dto.UserResponseDto;
import com.blooddonation.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponseDto login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserResponseDto userResponse = userService.getUserByEmail(loginDto.getEmail());

        return new AuthResponseDto(jwt, userResponse);
    }

    public AuthResponseDto register(UserRegistrationDto registrationDto) {
        // 1. Créer l'utilisateur
        UserResponseDto userResponse = userService.registerUser(registrationDto);

        // 2. Créer l'authentification manuellement (sans passer par AuthenticationManager)
        // car l'utilisateur vient d'être créé et le mot de passe est déjà encodé
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                registrationDto.getEmail(),
                null, // pas besoin du mot de passe pour générer le token
                java.util.Collections.emptyList() // authorities vides pour l'instant
        );

        // 3. Générer le token JWT
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponseDto(jwt, userResponse);
    }
}