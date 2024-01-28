package org.example;

import io.reactivex.Completable;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.bridge.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSBridgeOptions;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.handler.BodyHandler;
import io.vertx.reactivex.ext.web.handler.StaticHandler;
import io.vertx.reactivex.ext.web.handler.sockjs.SockJSHandler;
import io.vertx.reactivex.kafka.client.consumer.KafkaConsumer;
import io.vertx.reactivex.kafka.client.producer.KafkaProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.example.config.KafkaConfig.consumerConfig;
import static org.example.config.KafkaConfig.producerConfig;

public class ClientRenderingAppVerticle extends AbstractVerticle {
    private static final int HTTP_PORT = 8080;
    private static final Logger logger = LoggerFactory.getLogger(ClientRenderingAppVerticle.class);

    private WebClient webClient;
    private KafkaProducer<String, JsonObject> kafkaProducer;

    // TODO:
    //      0. enhance readability and maintainability by separating logics
    //      1. add prefix on addresses of Kafka (e.g. kf.*) and Eventbus (e.g. eb.*)
    @Override
    public Completable rxStart() {

        webClient = WebClient.create(vertx);
        kafkaProducer = KafkaProducer.create(vertx, producerConfig());

//        KafkaConsumer.<String, JsonObject>create(vertx, consumerConfig("user-group"))
//                .subscribe("user.presence")
//                .toFlowable()
//                .subscribe(
//                        record -> vertx.eventBus().publish("client.updates.user.presence", record.value()),
//                        err -> logger.error("Forwarding's been failed.")
//                );

        KafkaConsumer.<String, JsonObject>create(vertx, consumerConfig("user-group"))
                .subscribe("user.register")
                .toFlowable()
                .subscribe(
                        record -> vertx.eventBus().publish("client.updates.user.register", record.value()),
                        err -> logger.error("Forwarding's been failed.")
                );

        KafkaConsumer.<String, JsonObject>create(vertx, consumerConfig("user-group"))
                .subscribe("user.presence.update")
                .toFlowable()
                .subscribe(
                        record -> vertx.eventBus().publish("client.updates.user.presence", record.value()),
                        err -> logger.error("Forwarding's been failed.")
                );

        Router router = Router.router(vertx);
        router.route().handler(StaticHandler.create());

        BodyHandler bodyHandler = BodyHandler.create();
        router.post().handler(bodyHandler);

        SockJSHandler sockJSHandler = SockJSHandler.create(vertx);
        SockJSBridgeOptions bridgeOptions = new SockJSBridgeOptions()
                .addInboundPermitted(new PermittedOptions().setAddressRegex("client.updates.*"))
                .addOutboundPermitted(new PermittedOptions().setAddressRegex("client.updates.*"));
        sockJSHandler.bridge(bridgeOptions);
        router.route("/eventbus/*").handler(sockJSHandler);

        // demo
        router.get("/greeting").handler(ctx -> {
            ctx.response()
                    .putHeader("Content-Type", "text/plain")
                    .end("Greetings from Vert.x server.");
        });

        return vertx.createHttpServer()
                .requestHandler(router)
                .rxListen(HTTP_PORT)
                .ignoreElement();
    }

    public static void main(String[] args )
    {
        Vertx vertx = Vertx.vertx();
        vertx.rxDeployVerticle(new ClientRenderingAppVerticle())
                .subscribe(
                    ok -> logger.info("HTTP server started on port {}", HTTP_PORT),
                    err -> logger.error(err.getMessage())
                );
    }
}
