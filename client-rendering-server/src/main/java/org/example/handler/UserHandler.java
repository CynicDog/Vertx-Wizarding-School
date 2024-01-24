package org.example.handler;

import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.kafka.client.producer.KafkaProducer;
import io.vertx.reactivex.kafka.client.producer.KafkaProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserHandler {

    private final static Logger logger = LoggerFactory.getLogger(UserHandler.class);

    public static void postUserPresence(RoutingContext ctx, KafkaProducer kafkaProducer) {

        String username = ctx.getBodyAsJson().getString("username");
        JsonObject record = ctx.getBodyAsJson();

        kafkaProducer
                .rxSend(KafkaProducerRecord.create("user.presence", username, record))
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
    }
}
