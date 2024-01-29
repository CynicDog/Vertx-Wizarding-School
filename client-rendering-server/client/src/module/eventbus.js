import EventBus from 'vertx3-eventbus-client';

const eventbus = new EventBus("http://localhost:8080/eventbus");
eventbus.enableReconnect(true);

const handlers = [];

export const pushHandler = (eventTopic , callback) => {
    handlers.push({ eventTopic, callback });
};

const registerHandlers = () => {
    handlers.forEach(({ eventTopic, callback }) => {
        eventbus.registerHandler(eventTopic, callback);
    });
};

eventbus.onopen = () => {
    registerHandlers();
}

export default eventbus;
