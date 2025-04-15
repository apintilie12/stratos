package com.sd.stratos.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.apache.commons.codec.binary.Base32;
import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.time.Instant;

@Component
public class TotpUtil {

    public String generateSecret() {
        byte[] buffer = new byte[20];
        new SecureRandom().nextBytes(buffer);
        return new Base32().encodeToString(buffer).replace("=", "");
    }


    public String getOtpAuthURL(String username, String secret) {
        return String.format("otpauth://totp/Stratos:%s?secret=%s&issuer=Stratos", username, secret);
    }

    public String generateQRCodeBase64(String otpAuthUrl) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(otpAuthUrl, BarcodeFormat.QR_CODE, 250, 250);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return Base64.encodeBase64String(pngOutputStream.toByteArray());
    }

    public boolean verifyCode(String username, String code, String secret) {
        try {
            Base32 base32 = new Base32();
            byte[] key = base32.decode(secret);
            long timeWindow = Instant.now().getEpochSecond() / 30; // TOTP window (30s)

            for (int i = -1; i <= 1; i++) { // allow ±1 window for slight clock drift
                String candidate = generateTOTP(key, timeWindow + i);
                if (candidate.equals(code)) {
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String generateTOTP(byte[] key, long timeIndex) throws Exception {
        ByteBuffer buffer = ByteBuffer.allocate(8);
        buffer.putLong(timeIndex);
        byte[] timeBytes = buffer.array();

        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(new SecretKeySpec(key, "HmacSHA1"));
        byte[] hash = mac.doFinal(timeBytes);

        int offset = hash[hash.length - 1] & 0x0F;
        int binary = ((hash[offset] & 0x7F) << 24)
                     | ((hash[offset + 1] & 0xFF) << 16)
                     | ((hash[offset + 2] & 0xFF) << 8)
                     | (hash[offset + 3] & 0xFF);

        int otp = binary % 1_000_000;
        return String.format("%06d", otp);
    }
}
