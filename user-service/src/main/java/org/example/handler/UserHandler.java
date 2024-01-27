package org.example.handler;

import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.mongo.MongoClient;
import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.kafka.client.producer.KafkaProducer;
import io.vertx.reactivex.kafka.client.producer.KafkaProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;

public class UserHandler {

    private static final Logger logger = LoggerFactory.getLogger(UserHandler.class);

    public static void getProfile(RoutingContext ctx, MongoClient mongoClient) {
        String username = ctx.request().getParam("username");

        JsonObject query = new JsonObject().put("username", username);
        JsonObject fields = new JsonObject()
                .put("_id", 0)
                .put("username", 1)
                .put("emailAddress", 1)
                .put("type", 1)
                .put("createdAt", 1)
                .put("profilePhoto", 1)
                .put("presence", 1)
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
                            logger.info("Found user with the name of {}", json.getString("username"));
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

    public static void postPresence(RoutingContext ctx, MongoClient mongoClient, KafkaProducer kafkaProducer) {
        String username = ctx.request().getParam("username");
        JsonObject bodyRecord = ctx.getBodyAsJson();

        // for database update
        JsonObject query = new JsonObject().put("username", username);
        JsonObject presenceData = new JsonObject().put("$set", new JsonObject().put("presence", bodyRecord.getString("newPresence")));

        // for kafka messaging publish
        bodyRecord.put("publisher", "User Service");
        bodyRecord.put("at", LocalDate.now().toString());

        mongoClient.rxFindOneAndUpdate("user", query, presenceData)
                .ignoreElement()
                .subscribe(
                        () -> {
                            logger.info("Successfully updated.");
                            kafkaProducer
                                    .rxSend(KafkaProducerRecord.create("user.presence", username, bodyRecord))
                                    .subscribe(
                                            response -> {
                                                logger.info("KafkaProducer.rxSend on the topic of 'user.presence' - " + ctx.response().getStatusMessage());
                                                ctx.response().end();
                                            },
                                            err -> {
                                                logger.error("Publishing user presence failed.");
                                                ctx.fail(500);
                                            }
                                    );
                            ctx.response().end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }
}
