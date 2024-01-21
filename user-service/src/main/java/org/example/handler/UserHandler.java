package org.example.handler;

import io.reactivex.Maybe;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.mongo.MongoClient;
import io.vertx.reactivex.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserHandler.class);

    public static void fetchUser(RoutingContext ctx, MongoClient mongoClient) {
        String username = ctx.request().getParam("username");

        JsonObject query = new JsonObject()
                .put("username", username);

        JsonObject fields = new JsonObject()
                .put("_id", 0)
                .put("username", 1)
                .put("emailAddress", 1)
                .put("type", 1)
                .put("createdAt", 1)
                .put("house", 1)
                .put("wand", 1)
                .put("patronus", 1)
                .put("pet", 1);

        mongoClient
                .rxFindOne("user", query, fields)
                .toSingle()
                .subscribe(
                        json -> {
                            logger.info("Found user of {}", json.toString());
                            ctx.response().putHeader("Content-Type", "application/json").end(json.encode());
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        });
    }

    public static void isUniqueUsername(RoutingContext ctx, MongoClient mongoClient) {
        String username = ctx.request().getParam("username");

        if (username != null) {
            JsonObject query = new JsonObject().put("username", username);
            mongoClient
                    .rxFindOne("user", query, new JsonObject())
                    .switchIfEmpty(Maybe.just(new JsonObject()))
                    .toSingle()
                    .subscribe(
                            user -> {
                                if (user.isEmpty()) {
                                    // unique
                                    ctx.response().setStatusCode(200).end();
                                } else {
                                    // duplicate
                                    ctx.response().setStatusCode(409).end();
                                }
                            },
                            err -> {
                                logger.error(err.getMessage());
                                ctx.fail(err);
                            });
        } else {
            // Invalid request, missing or null email parameter
            ctx.response().setStatusCode(400).end("Invalid request");
        }
    }

    public static void isUniqueEmailAddress(RoutingContext ctx, MongoClient mongoClient) {
        String emailAddress = ctx.request().getParam("email-address");

        if (emailAddress != null) {
            JsonObject query = new JsonObject().put("emailAddress", emailAddress);
            mongoClient
                    .rxFindOne("user", query, new JsonObject())
                    .switchIfEmpty(Maybe.just(new JsonObject()))
                    .toSingle()
                    .subscribe(
                            user -> {
                                if (user.isEmpty()) {
                                    // unique
                                    ctx.response().setStatusCode(200).end();
                                } else {
                                    // duplicate
                                    ctx.response().setStatusCode(409).end();
                                }
                            },
                            err -> {
                                logger.error(err.getMessage());
                                ctx.fail(err);
                            });
        } else {
            // Invalid request, missing or null email parameter
            ctx.response().setStatusCode(400).end("Invalid request");
        }
    }
}
