package org.example.handler;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.mongo.MongoClient;
import io.vertx.reactivex.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

public class HouseHandler {

    private static final Logger logger = LoggerFactory.getLogger(HouseHandler.class);

    public static void getHouse(RoutingContext ctx, MongoClient mongoClient) {
        String houseTitle = ctx.pathParam("houseTitle");

        JsonObject query = new JsonObject().put("title", houseTitle);
        JsonObject fields = new JsonObject()
                .put("_id", 0)
                .put("title", 1)
                .put("quota", 1)
                .put("points", 1)
                .put("head", 1)
                .put("students", 1);

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

    public static void getHouseUsers(RoutingContext ctx, MongoClient mongoClient) {
        String houseTitle = ctx.pathParam("houseTitle");

        JsonObject query = new JsonObject().put("title", houseTitle);
        JsonObject fields = new JsonObject().put("students", 1);

        mongoClient.rxFindOne("house", query, fields)
                .toSingle()
                .flatMap(house -> {
                    List<String> studentIds = house
                            .getJsonArray("students", new JsonArray())
                            .stream()
                            .map(studentObj -> ((JsonObject) studentObj).getString("$oid"))
                            .collect(Collectors.toList());

                    JsonObject userQuery = new JsonObject().put("_id", new JsonObject().put("$in", studentIds));
                    JsonArray pipeline = new JsonArray()
                            .add(new JsonObject().put("$match", userQuery))
                            .add(new JsonObject().put("$project", new JsonObject()
                                    .put("username", 1)
                                    .put("emailAddress", 1)
                                    .put("presence", 1)
                                    .put("profilePhoto", 1)
                                    .put("type", 1)));

                    return mongoClient.aggregate("user", pipeline)
                            .toObservable()
                            .toList()
                            .map(students -> {
                                JsonObject result = new JsonObject().put("students", students);
                                return result;
                            });
                })
                .subscribe(result -> {
                    logger.info("Found users of " + result.size());
                    ctx.response().putHeader("Content-Type", "application/json").end(result.encode());
                }, error -> {
                    // Handle error
                    ctx.response().setStatusCode(500).end("Internal Server Error");
                });
    }
}
