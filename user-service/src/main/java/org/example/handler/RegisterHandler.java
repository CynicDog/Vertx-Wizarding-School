package org.example.handler;

import io.reactivex.Maybe;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.auth.mongo.MongoAuthentication;
import io.vertx.reactivex.ext.auth.mongo.MongoUserUtil;
import io.vertx.reactivex.ext.mongo.MongoClient;
import io.vertx.reactivex.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RegisterHandler {

    private static final Logger logger = LoggerFactory.getLogger(RegisterHandler.class);

    public static void register(RoutingContext ctx, MongoClient mongoClient, MongoUserUtil mongoUserUtil) {

        JsonObject body = ctx.getBodyAsJson();
        String username = body.getString("username");
        String password = body.getString("password");

        JsonObject supplementaryDetails = new JsonObject()
                .put("$set", new JsonObject())
                .put("emailAddress", body.getString("emailAddress"))
                .put("house", body.getString("house"))
                .put("wand", body.getString("wand"))
                .put("patronus", body.getString("patronus"))
                .put("pet", body.getString("pet"));

        mongoUserUtil
                .rxCreateUser(username, password)
                .flatMapMaybe(docId -> mongoClient
                        .rxFindOneAndUpdate("user", new JsonObject().put("_id", docId), supplementaryDetails)
                        .onErrorResumeNext(err -> {
                            return Maybe.error(err);
                        })
                );
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
