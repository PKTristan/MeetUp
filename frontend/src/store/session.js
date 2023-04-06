// frontend/src/store/session.js
import { csrfFetch } from './csrf';

//this file contains all actions specific to the session's user's

//get user
export const userSelector = (state) => state.session.user;

const LOAD_USER = "session/LOAD_USER";
const REMOVE_USER = "session/REMOVE_USER";

//load user info
export const loadUser = (user) => ({
    type: LOAD_USER,
    user
});

export const removeUser = () => ({
    type: REMOVE_USER
});


//login thunk action creator
export const login = (body) => async dispatch => {
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const {user} = await response.json();
        dispatch(loadUser(user));
    }

    return response;
};

//get current session
export const currentUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');

    if(response.ok) {
        const {user} = await response.json();
        dispatch(loadUser(user));
    }

    return response;
};

//sign up a user
export const signup = (body) => async dispatch => {
    const response = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const {user} = await response.json();
        dispatch(loadUser(user));
    }

    return response;
};

//logout thunk action creator
export const logout = () => async(dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(removeUser());
    }

    return response;
};

const initialState = { user: null };

//session reducer that will hold current session user info
const sessionReducer = (state = Object.assign({}, initialState), action) => {
    let mutState = Object.assign({}, state);

    switch (action.type) {

        case (LOAD_USER):
            mutState.user = action.user || null;

            return mutState;
        case (REMOVE_USER):
            mutState.user = null;

            return mutState;
        default:
            return state;
    }
};

export default sessionReducer;
