package com.sd.stratos.util;

import com.sd.stratos.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User user, int durationInMinutes) {
        return Jwts
                .builder()
                .subject(user.getUsername())
                .issuer("Stratos")
                .issuedAt(new Date(System.currentTimeMillis()))
                .claims(Map.of(
                        "userId", user.getId(),
                        "role", user.getRole()
                ))
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * durationInMinutes))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();
    }
}
