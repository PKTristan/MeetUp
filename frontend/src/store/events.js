// /frontend/src/store/events.js
import { csrfFetch } from "./csrf";
import normalizeData from "./normalizeData";

export const CLEAR_OPTIONS_EVENTS = {
    all: 'allEvents',
    groups: 'groupEvents',
    newId: 'newId'
}


const LOAD_EVENTS = "events/LOAD_EVENTS";
const LOAD_GROUP_EVENTS = "events/LOAD_GROUP_EVENTS";
const LOAD_DETAILS = "events/LOAD_DETAILS";
const CLEAR_EVENTS = "events/CLEAR_EVENTS";
const NEW_ID = "events/NEW_ID";

const loadEvents = (events) => ({
    type: LOAD_EVENTS,
    events
});

const loadGroupEvents = (events) => ({
    type: LOAD_GROUP_EVENTS,
    events
});

export const clearEvents = (options) => ({
    type: CLEAR_EVENTS,
    options
});

const loadDetails = (event) => ({
    type: LOAD_DETAILS,
    event
});

const newId = (id) => ({
    type: NEW_ID,
    id
});



export const getEvents = () => async (dispatch) => {
    const response = await csrfFetch("/api/events");

    if (response.ok) {
        const events = await response.json();
        dispatch(loadEvents(events));
    }

    return response;
};


export const getEventsByGroup = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId.id}/events`);

    if (response.ok) {
        const events = await response.json();
        dispatch(loadGroupEvents(events));
    }

    return response;
};

export const getEventDetails = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${id}`);

    if (response.ok) {
        const [event] = await response.json();
        dispatch(loadDetails(event));
    }

    return response;
}

export const createEvent = (event, groupId, url) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        body: JSON.stringify(event)
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        dispatch(addImage({url, preview: true}, data.event.id));
    }

    return response;
};

export const addImage = (body, eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        // idk do sumn
    }

    dispatch(getEvents());
    dispatch(newId(eventId));

    return response;
};

export const deleteEvent = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${id}`, {
        method: 'DElETE'
    });

    if (response.ok) {
        dispatch(getEvents());
    }

    return response;
}



export const allEventsSelector = (state) => state.events.allEvents;
export const groupEventsSelector = (state) => state.events.groupEvents;
export const selEventDetails = (state) => state.events.eventDetails;
export const selNewId = (state) => state.events.newId;


const initialState = { allEvents: null, groupEvents: null, eventDetails: null, newId: null };

const eventsReducer = (state = initialState, action) => {
    let mutState = Object.assign(state);
    switch (action.type) {
        case LOAD_EVENTS:

            return { ...mutState, allEvents: normalizeData(action.events) };
        case LOAD_GROUP_EVENTS:

            return { ...mutState, groupEvents: normalizeData(action.events) };

        case CLEAR_EVENTS:
            action.options.forEach((option) => {
                mutState[option] = null;
            });

            return { ...mutState };

        case LOAD_DETAILS:
            return { ...mutState, eventDetails: action.event };

        case NEW_ID:
            return { ...mutState, newId: action.id };

        default:
            return state;
    }
};


export default eventsReducer;
