package org.example.handler;

import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.JWTOptions;
import io.vertx.reactivex.ext.auth.jwt.JWTAuth;
import io.vertx.reactivex.ext.web.RoutingContext;
import io.vertx.reactivex.ext.web.client.WebClient;
import io.vertx.reactivex.ext.web.client.predicate.ResponsePredicate;
import io.vertx.reactivex.ext.web.codec.BodyCodec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AccountHandler {

    private static final Logger logger = LoggerFactory.getLogger(AccountHandler.class);

    public static void checkUsername(RoutingContext ctx, WebClient webClient) {

        String username = ctx.request().getParam("username");
        logger.info("Duplication validation on username of {}", username);

        webClient.get(3000, "localhost", "/is-unique?username=" + username)
                .expect(ResponsePredicate.SC_OK)
                .rxSend()
                .subscribe(
                        ok -> {
                            logger.info(ok.statusMessage());
                            ctx.response().setStatusCode(ok.statusCode()).end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }

    public static void checkEmailAddress(RoutingContext ctx, WebClient webClient) {

        String emailAddress = ctx.request().getParam("email-address");
        logger.info("Duplication validation on email address of {}", emailAddress);

        webClient.get(3000, "localhost", "/is-unique?email-address=" + emailAddress)
                .expect(ResponsePredicate.SC_OK)
                .rxSend()
                .subscribe(
                        ok -> {
                            logger.info(ok.statusMessage());
                            ctx.response().setStatusCode(ok.statusCode()).end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        }
                );
    }

    public static void register(RoutingContext ctx, WebClient webClient) {
        webClient
                .post(3000, "localhost", "/register")
                .putHeader("Content-Type", "application/json")
                .rxSendJson(ctx.getBodyAsJson())
                .subscribe(
                        response -> {
                            logger.info(response.statusMessage());
                            ctx.response().setStatusCode(response.statusCode()).end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(ctx.statusCode());
                        });
    }

    public static void token(RoutingContext ctx, WebClient webClient, JWTAuth jwtAuth) {
        JsonObject payload = ctx.getBodyAsJson();
        String username = payload.getString("username");

        // initial authenticate request
        webClient.post(3000, "localhost", "/authenticate")
                .expect(ResponsePredicate.SC_SUCCESS)
                .rxSendJson(payload)
                .flatMap(resp -> {
                    // fetch supplementary details on user
                    return webClient.get(3000, "localhost", "/" + username)
                            .expect(ResponsePredicate.SC_OK)
                            .as(BodyCodec.jsonObject())
                            .rxSend();
                })
                .map(resp -> resp.body().getString("patronus"))
                .map(patronus -> {
                    JsonObject claims = new JsonObject().put("patronus", patronus);
                    JWTOptions jwtOptions = new JWTOptions()
                            .setAlgorithm("RS256")
                            .setExpiresInMinutes(43_200) // a month
                            .setIssuer("Vertx-Wizarding-School")
                            .setSubject(username);

                    return jwtAuth.generateToken(claims, jwtOptions);
                })
                .subscribe(
                        token -> {
                            logger.info(ctx.response().getStatusMessage());
                            ctx.response().putHeader("Content-Type", "application/jwt").end(token);
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(err);
                        });
    }
}
