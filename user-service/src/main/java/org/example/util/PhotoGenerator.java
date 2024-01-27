package org.example.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;

public class PhotoGenerator {

    public static String generateUserProfile(String username) throws IOException {
        int imageSize = 100;
        BufferedImage image = new BufferedImage(imageSize, imageSize, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = image.createGraphics();

        Random random = new Random();
        Color backgroundColor = new Color(random.nextInt(256), random.nextInt(256), random.nextInt(256));
        graphics.setColor(backgroundColor);
        graphics.fillRect(0, 0, imageSize, imageSize);

        graphics.setColor(Color.WHITE); // You can customize the text color
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        graphics.setFont(new Font("SansSerif", Font.BOLD, 30)); // You can customize the font and size
        int x = (imageSize - graphics.getFontMetrics().stringWidth(username)) / 2;
        int y = imageSize / 2;
        graphics.drawString(username.substring(0, 1), x, y);

        graphics.dispose();

        // Convert BufferedImage to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        javax.imageio.ImageIO.write(image, "png", baos);
        byte[] imageBytes = baos.toByteArray();

        // Encode byte array to base64
        return Base64.getEncoder().encodeToString(imageBytes);
    }
}
