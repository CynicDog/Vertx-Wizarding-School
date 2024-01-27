package org.example;

import io.reactivex.Completable;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.eventbus.EventBus;
import io.vertx.reactivex.core.eventbus.Message;
import org.example.util.PhotoGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class PhotoGenerateVerticle extends AbstractVerticle {

    private static final Logger logger = LoggerFactory.getLogger(PhotoGenerateVerticle.class);

    @Override
    public Completable rxStart() {

        EventBus eventBus = vertx.eventBus();
        return eventBus
                .consumer("user.photo.generate", this::generate)
                .rxCompletionHandler()
                .cache();
    }

    private void generate(Message<String> message) {
        try {
            String base64Image = "data:image/png;base64," + PhotoGenerator.generateUserProfile(message.body());
            message.reply(base64Image);
        } catch (IOException e) {
            message.fail(500, "Error generating photo: " + e.getMessage());
        }
    }
}
