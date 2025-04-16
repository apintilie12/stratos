package com.sd.stratos.controller;

import com.google.zxing.WriterException;
import com.sd.stratos.dto.ExistingUserDTO;
import com.sd.stratos.dto.OTPVerificationRequest;
import com.sd.stratos.dto.PasswordResetRequest;
import com.sd.stratos.entity.User;
import com.sd.stratos.repository.UserRepository;
import com.sd.stratos.util.JwtUtil;
import com.sd.stratos.util.PasswordUtil;
import com.sd.stratos.util.TotpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordUtil passwordUtil;
    private final TotpUtil totpUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if(user != null && passwordUtil.checkPassword(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.ok(Map.of("token", jwtUtil.generateToken(user, 60), "user", ExistingUserDTO.from(user)));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/enable-otp/{username}")
    public ResponseEntity<String> enableOtpForUser(@PathVariable String username) throws IOException, WriterException {
        User user = userRepository.findByUsername(username);
        if(user == null) {
            return ResponseEntity.status(401).body("Invalid user");
        }
        if(user.getOtpSecret() == null) {
            String secret = totpUtil.generateSecret();
            user.setOtpSecret(secret);
        }
        user.setOtpEnabled(false);
        userRepository.save(user);

        String otpAuthURL = totpUtil.getOtpAuthURL(user.getUsername(), user.getOtpSecret());
        String base64QR = totpUtil.generateQRCodeBase64(otpAuthURL);

        return ResponseEntity.ok(base64QR);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Void> verifyOTP(@RequestBody OTPVerificationRequest request) {
        User user = userRepository.findByUsername(request.username());
        if(user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        boolean isValid = totpUtil.verifyCode(user.getUsername(), request.code(), user.getOtpSecret());
        if (isValid) {
            user.setOtpEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/verify-otp-reset")
    public ResponseEntity<Map<String, String>> verifyOTPReset(@RequestBody OTPVerificationRequest request) {
        User user = userRepository.findByUsername(request.username());
        if(user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        boolean isValid = totpUtil.verifyCode(user.getUsername(), request.code(), user.getOtpSecret());
        if (isValid) {
            return ResponseEntity.ok().body(Map.of("token", jwtUtil.generateToken(user, 5)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        User user = userRepository.findByUsername(request.username());
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        String newPasswordHash = passwordUtil.hashPassword(request.password());
        System.out.println("New password " + request.password() + " hash " + newPasswordHash);
        user.setPassword(newPasswordHash);
        userRepository.save(user);
        return ResponseEntity.ok("Password updated.");
    }

}
