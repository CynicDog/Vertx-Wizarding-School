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
//                .put("house", 1)
//                .put("wand", 1)
//                .put("patronus", 1)
//                .put("pet", 1)
                ;

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

    public static void postProfilePhoto(RoutingContext ctx, MongoClient mongoClient) {
        JsonObject query = new JsonObject().put("username", ctx.request().getParam("username"));
        JsonObject photoData = new JsonObject().put("$set", new JsonObject().put("profilePhoto", ctx.getBodyAsJson().getString("base64Data")));

        mongoClient.rxFindOneAndUpdate("user", query, photoData)
                .ignoreElement()
                .subscribe(
                        () -> {
                            logger.info("Successfully updated.");
                            ctx.response().end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }
}
