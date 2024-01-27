package org.example.handler;

import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.codec.BodyCodec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserHandler.class);

    public static void fetchMe(RoutingContext ctx, WebClient webClient) {
        String username = ctx.user().principal().getString("sub");

        webClient.get(3000, "localhost", "/profile?username=" + username)
                .as(BodyCodec.jsonObject())
                .rxSend()
                .subscribe(
                        response -> {
                            logger.info("response on the request on `GET :3000/profile` reads: {}", response.statusMessage());
                            ctx.response().putHeader("Content-Type", "application/json").end(response.body().encode());
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }

    public static void fetchUser(RoutingContext ctx, WebClient webClient) {
        String username = ctx.request().getParam("username");

        webClient.get(3000, "localhost", "/profile?username=" + username)
                .as(BodyCodec.jsonObject())
                .rxSend()
                .subscribe(
                        response -> {
                            logger.info("response on the request on `GET :3000/profile` reads: {}", response.statusMessage());
                            ctx.response().putHeader("Content-Type", "application/json").end(response.body().encode());
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }

    public static void postUserProfilePhoto(RoutingContext ctx, WebClient webClient) {
        String username = ctx.user().principal().getString("sub");
        String base64Data = ctx.getBodyAsJson().getString("base64Data");

        webClient.post(3000, "localhost", "/photo?username=" + username)
                .putHeader("Content-Type", "application/json")
                .rxSendJson(new JsonObject().put("base64Data", base64Data))
                .subscribe(
                        response -> {
                            logger.info("response on the request on `POST :3000/photo` reads: {}", response.statusMessage());
                            ctx.response().setStatusCode(200).end("Successfully uploaded.");
                        },
                        err -> {
                            // Handle errors
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }

    public static void postUserPresence(RoutingContext ctx, WebClient webClient) {
        String username = ctx.user().principal().getString("sub");

        webClient.post(3000, "localhost", "/presence?username=" + username)
                .putHeader("Content-Type", "application/json")
                .rxSendJson(ctx.getBodyAsJson())
                .subscribe(
                        response -> {
                            logger.info("response on the request on `POST :3000/presence` reads: {}", response.statusMessage());
                            ctx.response().setStatusCode(200).end();
                        },
                        err -> {
                            // Handle errors
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }
}
