package org.example;

import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeployerVerticle {

    private static final int HTTP_PORT = 3000;
    private static final Logger logger = LoggerFactory.getLogger(DeployerVerticle.class);

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
