package org.example.handler;

import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.mongo.MongoClient;
import io.vertx.reactivex.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HouseHandler {

    private static final Logger logger = LoggerFactory.getLogger(HouseHandler.class);

    public static void getHouse(RoutingContext ctx, MongoClient mongoClient) {
        String houseTitle = ctx.pathParam("houseTitle");

        JsonObject query = new JsonObject().put("title", houseTitle);
        JsonObject fields = new JsonObject()
                .put("_id", 0)
                .put("title", 1)
                .put("quota", 1)
                .put("points", 1);

        mongoClient.rxFindOne("house", query, fields)
                .toSingle()
                .subscribe(
                        json -> {
                            logger.info("Found house with the title of {}", json.getString("title"));
                            ctx.response().putHeader("Content-Type", "application/json").end(json.encode());
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        });
    }
}
