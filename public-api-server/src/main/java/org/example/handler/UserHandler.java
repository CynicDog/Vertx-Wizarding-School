package org.example.handler;

import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.core.buffer.Buffer;
import io.vertx.reactivex.ext.web.FileUpload;
import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.client.predicate.ResponsePredicate;
import io.vertx.reactivex.ext.web.codec.BodyCodec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserHandler.class);

    public static void fetchUser(RoutingContext ctx, WebClient webClient) {
        String username = ctx.user().principal().getString("sub");

        webClient.get(3000, "localhost", "/fetch-user?username=" + username)
                .as(BodyCodec.jsonObject())
                .rxSend()
                .subscribe(
                        response -> {
                            logger.info("response on the request on `GET :3000/fetch-user?username` reads: {}", response.statusMessage());
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

        webClient.post(3000, "localhost", "/user-profile-photo?username=" + username)
                .putHeader("Content-Type", "application/json")
                .rxSendJson(new JsonObject().put("base64Data", base64Data))
                .subscribe(
                        response -> {
                            logger.info("response on the request on `POST :3000/user-profile-photo` reads: {}", response.statusMessage());
                            ctx.response().setStatusCode(200).end("Successfully uploaded.");
                        },
                        err -> {
                            // Handle errors
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }
}
