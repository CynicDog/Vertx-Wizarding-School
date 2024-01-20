package org.example.handler;

import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.codec.BodyCodec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserHandler.class);

    public static void fetchUser(RoutingContext ctx, WebClient webClient) {
        webClient.get(3000, "localhost", "/" + ctx.pathParam("username"))
                .as(BodyCodec.jsonObject())
                .rxSend()
                .subscribe(
                        response -> {
                            logger.info(response.statusMessage());
                            ctx.response().putHeader("Content-Type", "application/json").end(response.body().encode());
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(ctx.statusCode());
                        }
                );
    }
}
