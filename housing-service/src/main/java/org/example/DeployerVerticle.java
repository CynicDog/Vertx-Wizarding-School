package org.example;

import io.vertx.core.VertxOptions;
import io.vertx.reactivex.core.Vertx;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Hello world!
 *
 */
public class DeployerVerticle {
    private static final int HTTP_PORT = 5000;
    private static final Logger logger = LoggerFactory.getLogger(DeployerVerticle.class);

    public static void main(String[] args ) {

        Vertx.vertx()
                .rxDeployVerticle(new RouterVerticle())
                .subscribe(
                        ok -> logger.info("HTTP server started on port {}", HTTP_PORT),
                        err -> logger.error(err.getMessage())
                );
    }
}
