package org.example.handler;

import io.reactivex.Maybe;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.eventbus.EventBus;
import io.vertx.reactivex.ext.auth.mongo.MongoAuthentication;
import io.vertx.reactivex.ext.auth.mongo.MongoUserUtil;
import io.vertx.reactivex.ext.mongo.MongoClient;
import io.vertx.reactivex.ext.web.RoutingContext;

import io.vertx.reactivex.kafka.client.producer.KafkaProducer;
import io.vertx.reactivex.kafka.client.producer.KafkaProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.Date;

public class RegisterHandler {

    private static final Logger logger = LoggerFactory.getLogger(RegisterHandler.class);

    public static void register(RoutingContext ctx, MongoClient mongoClient, MongoUserUtil mongoUserUtil, KafkaProducer kafkaProducer, EventBus eventBus) {
        JsonObject body = ctx.getBodyAsJson();

        String username = body.getString("username");
        String password = body.getString("password");

        // TODO: resiliency over failures of eventbus, mongodb and kafka server
        eventBus.<String>rxRequest("user.photo.generate", username)
                .flatMapCompletable(photo -> {
                    JsonObject supplementaryDetails = new JsonObject()
                            .put("$set", new JsonObject()
                                    .put("emailAddress", body.getString("emailAddress"))
                                    .put("type", body.getString("type"))
                                    .put("createdAt", new Date().getTime())
                                    .put("profilePhoto", photo.body())
                                    .put("presence", "available")
                                    .put("house", "")
                            );

                    return mongoUserUtil
                            .rxCreateUser(username, password)
                            .flatMapMaybe(docId ->
                                    mongoClient
                                            .rxFindOneAndUpdate("user", new JsonObject().put("_id", docId), supplementaryDetails)
                                            .onErrorResumeNext(err -> {
                                                return Maybe.error(err);
                                            }))
                            .ignoreElement();
                }).subscribe(
                        () -> {
                            logger.info("Registered successfully.");

                            JsonObject bodyRecord = new JsonObject()
                                    .put("publisher",  "👨🏻‍💻 User Service")
                                    .put("at", LocalDate.now().toString())
                                    .put("content", String.format("'%s' has joined our community!", username));

                            kafkaProducer
                                    .rxSend(KafkaProducerRecord.create("KF.user.register", username, bodyRecord))
                                    .subscribe(
                                            response -> logger.info("KafkaProducer.rxSend on the topic of 'KF.user.register' - " + ctx.response().getStatusMessage()),
                                            err -> logger.error("Publishing kafka record's been failed.")
                                    );
                            ctx.response().end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
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

    public static void authenticate(RoutingContext ctx, MongoAuthentication mongoAuthProvider) {
        mongoAuthProvider.rxAuthenticate(ctx.getBodyAsJson())
                .subscribe(
                        user -> {
                            logger.info("Found user of {}", user.toString());
                            ctx.response().setStatusCode(200).end();
                        },
                        err -> {
                            logger.error("Authentication problem {}", err.getMessage());
                            ctx.response().setStatusCode(401).end();
                        }
                );
    }
}
