package org.example.handler;

import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.codec.BodyCodec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HouseHandler {

    private static final Logger logger = LoggerFactory.getLogger(HouseHandler.class);

    public static void fetchHouse(RoutingContext ctx, WebClient webClient) {
        String houseTitle = ctx.pathParam("houseTitle");

        webClient.get(5000, "localhost", "/house/" + houseTitle)
                .as(BodyCodec.jsonObject())
                .rxSend()
                .subscribe(
                        response -> {
                            logger.info("response on the request on `GET :5000/house/:houseTitle` reads: {}", response.statusMessage());
                            ctx.response().putHeader("Content-Type", "application/json").end(response.body().encode());
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }
}
