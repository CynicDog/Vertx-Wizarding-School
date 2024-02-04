import EventBus from 'vertx3-eventbus-client';

const eventbus = new EventBus("http://localhost:8080/eventbus");
eventbus.enableReconnect(true);

const handlers = [];

export const registerHandler = (eventTopic , callback) => {
    handlers.push({ eventTopic, callback });
};

const registerHandlers = () => {
    handlers.forEach(({ eventTopic, callback }) => {
        console.log(`handler for '${eventTopic}' got registered `)
        eventbus.registerHandler(eventTopic, callback);
    });
};

eventbus.onopen = () => {
    registerHandlers();
}

export default eventbus;
