package org.example.util;

import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.auth.jwt.JWTAuth;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class SecretsHelper {

    public static String readFromResources(String fileName) {
        try (InputStream inputStream = SecretsHelper.class.getClassLoader().getResourceAsStream(fileName)) {
            byte[] bytes = inputStream.readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static JWTAuth populate(Vertx vertx)  {
        return JWTAuth.create(vertx, new JWTAuthOptions()
                .addPubSecKey(new PubSecKeyOptions()
                        .setAlgorithm("RS256")
                        .setBuffer(readFromResources("public_key.pem")))
                .addPubSecKey(new PubSecKeyOptions()
                        .setAlgorithm("RS256")
                        .setBuffer(readFromResources("private_key.pem"))));
    }
}
