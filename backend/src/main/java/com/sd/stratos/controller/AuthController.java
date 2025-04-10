package com.sd.stratos.controller;

import com.sd.stratos.entity.User;
import com.sd.stratos.repository.UserRepository;
import com.sd.stratos.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if(user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(Map.of("token", jwtUtil.generateToken(user), "user", user));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

}
