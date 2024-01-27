package org.example.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;

public class PhotoGenerator {

    private static final Color[] PASTEL_COLORS = {
            hexToColor("EE352E"),
            hexToColor("00933C"),
            hexToColor("0033A0"),
            hexToColor("0039A6"),
            hexToColor("FFD100"),
            hexToColor("FF6319"),
            hexToColor("B933AD"),
            hexToColor("0033A0"),
            hexToColor("FF6319"),
            hexToColor("0033A0"),
            hexToColor("FF6319"),
            hexToColor("6CBE45"),
            hexToColor("996633"),
            hexToColor("A7A9AC"),
            hexToColor("FF6319"),
            hexToColor("FCCC0A"),
            hexToColor("FCCC0A"),
            hexToColor("FCCC0A"),
            hexToColor("FCCC0A")
    };

    private static Color hexToColor(String hex) {
        return new Color(
                Integer.valueOf(hex.substring(0, 2), 16),
                Integer.valueOf(hex.substring(2, 4), 16),
                Integer.valueOf(hex.substring(4, 6), 16)
        );
    }

    public static String generateUserProfile(String username) throws IOException {
        int imageSize = 50;
        BufferedImage image = new BufferedImage(imageSize, imageSize, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = image.createGraphics();

        // Randomly choose a pastel color
        Random random = new Random();
        Color backgroundColor = PASTEL_COLORS[random.nextInt(PASTEL_COLORS.length)];

        graphics.setColor(backgroundColor);
        graphics.fillRect(0, 0, imageSize, imageSize);

        graphics.setColor(Color.WHITE); // You can customize the text color
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        graphics.setFont(new Font("SansSerif", Font.PLAIN, 30)); // You can customize the font and size

        FontMetrics fontMetrics = graphics.getFontMetrics();
        int stringWidth = fontMetrics.stringWidth(username.substring(0, 1));
        int stringHeight = fontMetrics.getHeight();

        float x = (imageSize - stringWidth) / 2f;
        float y = (imageSize - stringHeight) / 2f + fontMetrics.getAscent(); // Adjust y to include ascent

        graphics.drawString(username.substring(0, 1), x, y - 1.3f);

        graphics.dispose();

        // Convert BufferedImage to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        javax.imageio.ImageIO.write(image, "png", baos);
        byte[] imageBytes = baos.toByteArray();

        // Encode byte array to base64
        return Base64.getEncoder().encodeToString(imageBytes);
    }
}
