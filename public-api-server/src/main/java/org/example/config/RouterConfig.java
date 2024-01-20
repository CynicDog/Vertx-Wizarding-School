package org.example.config;

import io.vertx.core.http.HttpMethod;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public interface RouterConfig {

    static Set<String> allowedHeaders() {
        return Stream.of("x-requested-with",
                        "Access-Control-Allow-Origin",
                        "origin",
                        "Content-Type",
                        "accept",
                        "Authorization")
                .collect(Collectors.toSet());
    }

    static Set<HttpMethod> allowedMethods() {
        return Stream.of(HttpMethod.GET,
                        HttpMethod.POST,
                        HttpMethod.OPTIONS,
                        HttpMethod.PUT)
                .collect(Collectors.toSet());
    }
}
