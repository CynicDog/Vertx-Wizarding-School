package org.example.config;

import io.vertx.core.json.JsonObject;

public interface MongoConfig {

    static JsonObject mongoConfig() {
        return new JsonObject()
                .put("host", "localhost")
                .put("port", 27017)
                .put("db_name", "profiles");
    }
}
