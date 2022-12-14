package org.example.configuration.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import org.example.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

import static java.lang.String.format;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    private final String jwtSecret = "zdtlDeos873KjjuwodkLDPDpl99uyk3JKyy*did5sseII6m6wTTgsNFhqzjqP";
    private final String jwtIssuer = "step.io";

    public String generateAccessToken(UserEntity user) {
        String role = user.getRole().getName();
        List<Integer> marks = user.getRaiting();
        int raiting = 0;
        if(marks != null)
        {
            for(Integer item: marks)
                raiting+= item;
            raiting = raiting / marks.size();
        }
        return Jwts.builder()
                .setSubject(format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s", user.getId(), user.getEmail(),user.getLastName(),
                        user.getFirstName(),user.getMiddleName(),user.getImage(),user.getAddress(),user.getPhone(),role,raiting))
                .claim("id",user.getId())
                .claim("email", user.getEmail())
                .claim("lastName", user.getLastName())
                .claim("firstName", user.getFirstName())
                .claim("middleName", user.getMiddleName())
                .claim("image",user.getImage())
                .claim("address",user.getAddress())
                .claim("phone",user.getPhone())
                .claim("role", role)
                .claim("raiting",raiting)
                .setIssuer(jwtIssuer)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)) // 1 week
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject().split(",")[0];
    }

    public String getUsername(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject().split(",")[1];
    }

    public Date getExpirationDate(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.getExpiration();
    }

    public boolean validate(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (SignatureException ex) {
            System.out.println("Invalid JWT signature - "+ ex.getMessage());
        } catch (MalformedJwtException ex) {
            System.out.println("Invalid JWT token - " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            System.out.println("Expired JWT token - " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.out.println("Unsupported JWT token - " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.out.println("JWT claims string is empty - " + ex.getMessage());
        }
        return false;
    }
}