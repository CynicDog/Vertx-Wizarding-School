package org.example;

import io.reactivex.Completable;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.mongo.MongoAuthenticationOptions;
import io.vertx.ext.auth.mongo.MongoAuthorizationOptions;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.auth.mongo.MongoAuthentication;
import io.vertx.reactivex.ext.auth.mongo.MongoUserUtil;
import io.vertx.reactivex.ext.mongo.MongoClient;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.kafka.client.producer.KafkaProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.example.config.KafkaConfig.producerConfig;
import static org.example.config.MongoConfig.mongoConfig;
import static org.example.handler.RegisterHandler.*;
import static org.example.handler.UserHandler.*;

public class UserServiceVerticle extends AbstractVerticle {

    private static final int HTTP_PORT = 3000;
    private static final Logger logger = LoggerFactory.getLogger(UserServiceVerticle.class);

    private MongoClient mongoClient;
    private MongoAuthentication mongoAuthProvider;
    private MongoUserUtil mongoUserUtil;
    private KafkaProducer<String, JsonObject> kafkaProducer;

    @Override
    public Completable rxStart() {
        mongoClient = MongoClient.create(vertx, mongoConfig());
        mongoAuthProvider = MongoAuthentication.create(mongoClient, new MongoAuthenticationOptions());
        mongoUserUtil = MongoUserUtil.create(mongoClient, new MongoAuthenticationOptions(), new MongoAuthorizationOptions());
        kafkaProducer = KafkaProducer.create(vertx, producerConfig());

        Router router = Router.router(vertx);

        BodyHandler bodyHandler = BodyHandler.create();
        router.post().handler(bodyHandler);
        router.put().handler(bodyHandler);

        router.post("/register").handler(ctx -> register(ctx, mongoClient, mongoUserUtil));
        router.post("/authenticate").handler(ctx -> authenticate(ctx, mongoAuthProvider));
        router.get("/is-unique").handler(ctx -> {
            // duplicate validation either on username or email address
            if (ctx.request().getParam("username") != null) {
                isUniqueUsername(ctx, mongoClient);
            } else {
                isUniqueEmailAddress(ctx, mongoClient);
            }
        });

        router.get("/profile").handler(ctx -> getProfile(ctx, mongoClient));
        router.post("/photo").handler(ctx -> postProfilePhoto(ctx, mongoClient));
        router.post("/presence").handler(ctx -> postPresence(ctx, mongoClient, kafkaProducer));
        return vertx.createHttpServer()
                .requestHandler(router)
                .rxListen(HTTP_PORT)
                .ignoreElement();
    }

    public static void main(String[] args ) {
        Vertx.vertx()
                .rxDeployVerticle(new UserServiceVerticle())
                .subscribe(
                        ok -> logger.info("HTTP server started on port {}", HTTP_PORT),
                        err -> logger.error(err.getMessage())
                );
    }
}
