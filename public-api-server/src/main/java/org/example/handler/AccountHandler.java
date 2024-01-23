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
                            logger.info("response on the request on `GET :3000/is-unique?username` reads: {}", ok.statusMessage());
                            ctx.response().setStatusCode(ok.statusCode()).end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            if (err instanceof java.net.ConnectException) {
                                // detects if remote server is down
                                ctx.response().setStatusCode(500).end();
                            } else {
                                ctx.response().setStatusCode(409).end("Username is already in use.");
                            }
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
                            logger.info("response on the request on `GET :3000/is-unique?email-address` reads: {}", ok.statusMessage());
                            ctx.response().setStatusCode(ok.statusCode()).end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            if (err instanceof java.net.ConnectException) {
                                // detects if remote server is down
                                ctx.response().setStatusCode(500).end();
                            } else {
                                ctx.response().setStatusCode(409).end("Email address is already in use.");
                            }
                        }
                );
    }

    public static void register(RoutingContext ctx, WebClient webClient) {
        webClient
                .post(3000, "localhost", "/register")
                .putHeader("Content-Type", "application/json")
                .rxSendJson(ctx.getBodyAsJson())
                .subscribe(
                        resp -> {
                            logger.info("response on the request on `POST :3000/register` reads: {}", resp.statusMessage());
                            ctx.response().setStatusCode(resp.statusCode()).end();
                        },
                        err -> {
                            logger.error(err.getMessage());
                            ctx.fail(ctx.statusCode());
                        });
    }

    public static void login(RoutingContext ctx, WebClient webClient, JWTAuth jwtAuth) {
        JsonObject payload = ctx.getBodyAsJson();
        String username = payload.getString("username");

        // initial authenticate request
        webClient.post(3000, "localhost", "/authenticate")
                .expect(ResponsePredicate.SC_SUCCESS)
                .rxSendJson(payload)
                .flatMap(resp -> {
                    logger.info("response on the request on `POST :3000/authenticate` reads: {}", resp.statusMessage());
                    // fetch supplementary details on user
                    return webClient.get(3000, "localhost", "/fetch-user?username=" + username)
                            .expect(ResponsePredicate.SC_OK)
                            .as(BodyCodec.jsonObject())
                            .rxSend();
                })
                .map(resp -> {
                    logger.info("response on the request on `GET :3000/fetch-user?username` {} reads: {}", username, resp.statusMessage());
                    return resp.body().getString("emailAddress");
                })
                .map(email -> {
                    JsonObject claims = new JsonObject().put("emailAddress", email);
                    JWTOptions jwtOptions = new JWTOptions()
                            .setAlgorithm("RS256")
                            .setExpiresInMinutes(43_200) // a month
                            .setIssuer("Vertx-Wizarding-School")
                            .setSubject(username);
                    return jwtAuth.generateToken(claims, jwtOptions);
                })
                .subscribe(
                        token -> {
                            logger.info("Token issued with the value of {}", token);
                            ctx.response().putHeader("Content-Type", "application/jwt").end(token);
                        },
                        err -> {
                            logger.error(err.getMessage());
                            if (err instanceof java.net.ConnectException) {
                                // detects if remote server is down
                                ctx.response().setStatusCode(500).end();
                            } else {
                                ctx.response().setStatusCode(401).end("Wrong credentials. Check your username and password again please.");
                            }
                        });
    }
}
