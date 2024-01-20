package org.example;

import io.reactivex.Completable;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.auth.jwt.JWTAuth;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.CorsHandler;
import io.vertx.reactivex.ext.web.handler.JWTAuthHandler;
import org.example.util.SecretsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

import static org.example.config.RouterConfig.allowedHeaders;
import static org.example.config.RouterConfig.allowedMethods;
import static org.example.handler.AccountHandler.*;
import static org.example.handler.UserHandler.fetchUser;

public class PublicApiServerVerticle extends AbstractVerticle {

    private static final String prefix = "/api/v1";
    private static final int HTTP_PORT = 4000;
    private static final Logger logger = LoggerFactory.getLogger(PublicApiServerVerticle.class);

    private WebClient webClient;
    private JWTAuth jwtAuth;

    @Override
    public Completable rxStart() {

        // configure and setup JWT auth provider
        jwtAuth = SecretsHelper.populate(vertx);

        Router router = Router.router(vertx);
        webClient = WebClient.create(vertx);

        // enable CORS for all routes, allow specific headers and methods
        router.route().handler(CorsHandler.create("*")
                        .allowedHeaders(allowedHeaders())
                        .allowedMethods(allowedMethods()));

        // to handle JSON data contained in the body of those requests
        BodyHandler bodyHandler = BodyHandler.create();
        router.post().handler(bodyHandler);
        router.post().handler(bodyHandler);

        JWTAuthHandler jwtAuthHandler = JWTAuthHandler.create(jwtAuth);

        { // handles requests on account data
            router.get(prefix + "/user/check").handler(ctx -> {
                // duplicate validation either on username or email address
                if (ctx.request().getParam("username") != null) {
                    checkUsername(ctx, webClient);
                } else {
                    checkEmailAddress(ctx, webClient);
                }
            }

            );
            router.post(prefix + "/register").handler(ctx -> register(ctx, webClient));
            router.post(prefix + "/token").handler(ctx -> token(ctx, webClient, jwtAuth));
        }

        { // handles requests on user profile data
            router.get(prefix + "/user/profile").handler(jwtAuthHandler).handler(ctx -> fetchUser(ctx, webClient));
        }


        return vertx.createHttpServer()
                .requestHandler(router)
                .rxListen(HTTP_PORT)
                .ignoreElement();
    }

    public static void main(String[] args ) {
        Vertx.vertx()
                .rxDeployVerticle(new PublicApiServerVerticle())
                .subscribe(
                        ok -> logger.info("HTTP server started on port {}", HTTP_PORT),
                        err -> logger.error(err.getMessage())
                );
    }
}
