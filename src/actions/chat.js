import {
  TOPIC_SUBSCRIBE,
  TOPIC_UNSUBSCRIBE,
} from '../middleware/SubscriptionService';

import { disconnectWS } from '../actions/stomp';

const topicSubscribeAction = (topic, handler) => ({
  type: TOPIC_SUBSCRIBE,
  topic,
  handler,
});
export const subscribeTopic = (topic, handler = handleChatEvent) => dispatch =>
  dispatch(topicSubscribeAction(topic, handler));

const topicUnsubscribAction = topic => ({
  type: TOPIC_UNSUBSCRIBE,
  topic,
});
export const unsubscribeTopic = topic => dispatch =>
  dispatch(topicUnsubscribAction(topic));

export const TOPIC_SUBSCRIBED = 'TOPIC_SUBSCRIBED';
export const topicSubscribedAction = topic => ({
  type: TOPIC_SUBSCRIBED,
  topic,
});

export const TOPIC_UNSUBSCRIBED = 'TOPIC_UNSUBSCRIBED';
export const topicUnsubscribedAction = topic => ({
  type: TOPIC_UNSUBSCRIBED,
  topic,
});

export const ENTERING_ROOM = 'ENTERING_ROOM';
const enteringRoomAction = {
  type: ENTERING_ROOM,
};
export const ENTERED_ROOM = 'ENTERED_ROOM';
const enteredRoomAction = {
  type: ENTERED_ROOM,
};

export const enterRoom = room => dispatch => {
  // console.log(room);
  dispatch(enteringRoomAction);
  dispatch(subscribeTopic(`/topic/room.${room.id}`, handleChatEvent));
  dispatch(subscribeTopic(`/app/room.${room.id}.details`, handleChatEvent));
  dispatch(enteredRoomAction);
};

export const EXITING_ROOM = 'EXITING_ROOM';
const exitingRoomAction = {
  type: EXITING_ROOM,
};

export const EXITED_ROOM = 'EXITED_ROOM';
const exitedRoomAction = room => ({
  type: EXITED_ROOM,
  room,
});

export const exitRoom = room => dispatch => {
  dispatch(exitingRoomAction);
  dispatch(subscribeTopic(`/app/room.${room.id}.exit`));
  dispatch(unsubscribeTopic(`/topic/room.${room.id}`));
  dispatch(exitedRoomAction(room));
};

/* handlers for stomp messages */
export const ALL_ROOMS_FETCHED = 'ALL_ROOMS_FETCHED';
const allRoomsFetchedAction = rooms => ({
  type: ALL_ROOMS_FETCHED,
  rooms,
});
const handleAllRoomsFetched = event => allRoomsFetchedAction(event.rooms);

export const ROOM_DETAILS_FETCHED = 'ROOM_DETAILS_FETCHED';
const roomDetailsFetched = room => ({
  type: ROOM_DETAILS_FETCHED,
  room,
});
const handleRoomDetailsFetched = event => dispatch => {
  dispatch(roomDetailsFetched(event.room));
  dispatch(subscribeTopic(`/app/room.${event.room.id}.enter`, handleChatEvent));
};

export const ROOM_CREATED = 'ROOM_CREATED';
const roomCreatedAction = room => ({
  type: ROOM_CREATED,
  room,
});
const handleRoomCreated = event => roomCreatedAction(event.room);

export const USER_ENTERED = 'USER_ENTERED';
const userEnteredAction = attendee => ({
  type: USER_ENTERED,
  attendee,
});
const handleUserEntered = event => userEnteredAction(event.attendee);

export const USER_EXITED = 'USER_EXITED';
const userExitRoomAction = attendee => ({
  type: USER_EXITED,
  attendee,
});
const handleUserExited = event =>
  userExitRoomAction(event.roomId, event.attendee);

export const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
const chatMessageReceivedAction = message => ({
  type: CHAT_MESSAGE_RECEIVED,
  message,
});
export const handleChatMessage = (dispatch, data) => {
  const message = JSON.parse(data.body);
  console.log(message);
  dispatch(chatMessageReceivedAction(message));
};

export const USER_CONNECTED = 'USER_CONNECTED';
const handleUserConnected = event => dispatch => {
  dispatch(disconnectWS());
  // console.log(event);
};

/**
 * map event handler to type.
 * !!! BESURE THE ACTUAL HANDLERS ARE DEFINED BEFORE THIS MAP.
 */
const chatEventHandler = {
  ALL_ROOMS_FETCHED: handleAllRoomsFetched,
  ROOM_CREATED: handleRoomCreated,
  ROOM_DETAILS_FETCHED: handleRoomDetailsFetched,
  USER_ENTERED: handleUserEntered,
  USER_EXITED: handleUserExited,
  USER_CONNECTED: handleUserConnected,
};

export const handleChatEvent = (dispatch, data) => {
  // console.log(data);
  const event = JSON.parse(data.body);
  console.log(event);
  dispatch(chatEventHandler[event.type](event));
};