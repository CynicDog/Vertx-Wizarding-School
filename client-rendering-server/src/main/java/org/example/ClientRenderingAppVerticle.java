package org.example;

import io.reactivex.Completable;

import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClientRenderingAppVerticle extends AbstractVerticle {
    private static final int HTTP_PORT = 8080;
    private static final Logger logger = LoggerFactory.getLogger(ClientRenderingAppVerticle.class);

    @Override
    public Completable rxStart() {
        Router router = Router.router(vertx);
        router.route().handler(StaticHandler.create());

        router.get("/greeting").handler(ctx -> {
            ctx.response()
                    .putHeader("Content-Type", "text/plain")
                    .end("Greetings from Vert.x server.");
        });

        return vertx.createHttpServer()
                .requestHandler(router)
                .rxListen(HTTP_PORT)
                .ignoreElement();
    }

    public static void main(String[] args )
    {
        Vertx vertx = Vertx.vertx();
        vertx.rxDeployVerticle(new ClientRenderingAppVerticle())
                .subscribe(
                    ok -> logger.info("HTTP server started on port {}", HTTP_PORT),
                    err -> logger.error(err.getMessage())
                );
    }
}
