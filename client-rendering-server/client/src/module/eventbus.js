import EventBus from 'vertx3-eventbus-client';

const eventbus = new EventBus("http://localhost:8080/eventbus");
eventbus.enableReconnect(true);

export default eventbus;
