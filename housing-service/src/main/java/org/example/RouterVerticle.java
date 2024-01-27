package org.example;

import io.reactivex.Completable;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.mongo.MongoAuthenticationOptions;
import io.vertx.ext.auth.mongo.MongoAuthorizationOptions;
import io.vertx.reactivex.core.AbstractVerticle;
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
import static org.example.handler.HouseHandler.getHouse;

public class RouterVerticle extends AbstractVerticle {

    private static final int HTTP_PORT = 5000;
    private static final Logger logger = LoggerFactory.getLogger(RouterVerticle.class);

    private MongoClient mongoClient;
    private MongoUserUtil mongoUserUtil;
    private KafkaProducer<String, JsonObject> kafkaProducer;

    @Override
    public Completable rxStart() {
        mongoClient = MongoClient.create(vertx, mongoConfig());
        mongoUserUtil = MongoUserUtil.create(mongoClient, new MongoAuthenticationOptions(), new MongoAuthorizationOptions());
        kafkaProducer = KafkaProducer.create(vertx, producerConfig());

        Router router = Router.router(vertx);

        BodyHandler bodyHandler = BodyHandler.create();
        router.post().handler(bodyHandler);
        router.put().handler(bodyHandler);

        router.get("/house/:houseTitle").handler(ctx -> getHouse(ctx, mongoClient));

        return vertx.createHttpServer()
                .requestHandler(router)
                .rxListen(HTTP_PORT)
                .ignoreElement();
    }
}
