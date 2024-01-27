package org.example.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;

public class PhotoGenerator {

    private static final Color[] PASTEL_COLORS = {
            hexToColor("8db150"),
            hexToColor("c99f88"),
            hexToColor("bca78a"),
            hexToColor("3d3d3d"),
            hexToColor("477391"),
            hexToColor("665987"),
            hexToColor("42663a"),
            hexToColor("b33360"),
            hexToColor("cf7684"),
            hexToColor("94b79b"),
            hexToColor("d5a5a0"),
            hexToColor("747635")
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

        graphics.drawString(username.substring(0, 1), x + .9f, y - 1.3f);

        graphics.dispose();

        // Convert BufferedImage to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        javax.imageio.ImageIO.write(image, "png", baos);
        byte[] imageBytes = baos.toByteArray();

        // Encode byte array to base64
        return Base64.getEncoder().encodeToString(imageBytes);
    }
}
