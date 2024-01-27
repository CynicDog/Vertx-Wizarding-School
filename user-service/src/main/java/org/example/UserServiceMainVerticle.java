package org.example;

import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;

import org.example.service.PhotoGenerateVerticle;
import org.example.service.RouterVerticle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserServiceMainVerticle {

    private static final int HTTP_PORT = 3000;
    private static final Logger logger = LoggerFactory.getLogger(UserServiceMainVerticle.class);

    public static void main(String[] args ) {

        Vertx.clusteredVertx(new VertxOptions())
                .onSuccess(vertx -> {
                    vertx.deployVerticle(new PhotoGenerateVerticle());
                    vertx.deployVerticle(new RouterVerticle());
                }).onFailure(err -> {
                    logger.error(err.getMessage());
                });
    }
}
