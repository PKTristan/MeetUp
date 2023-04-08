// /frontend/src/store/groups
import { csrfFetch } from "./csrf";
import { useDispatch } from "react-redux";
import normalizeData from "./normalizeData";

export const LOAD_GROUPS = 'groups/LOAD_GROUPS';
export const CLEAR_GROUPS = 'groups/CLEAR_GROUPS';


//action creator to load groups
export const loadGroups = (groups) => ({
    type: LOAD_GROUPS,
    groups
});

export const clearGroups = () => ({
    type: CLEAR_GROUPS
});


//thunk action creator to fetch the /api/groups api
export const getAllGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups');


    if (response.ok) {
        const {Groups: groups} = await response.json();
        dispatch(loadGroups(groups));
    }

    return response;
}

export const allGroupsSelector = (state) => state.groups.allGroups;


//groups reducer
const initialState = { allGroups: null };

const groupsReducer = (state = initialState, action) => {
    let mutState = Object.assign(state);

    switch(action.type) {
        case LOAD_GROUPS:
            mutState.allGroups = normalizeData(action.groups);

            return mutState;

        case CLEAR_GROUPS:
            mutState.allGroups = null;

            return mutState;

        default:
            return state;
    }
}

export default groupsReducer;
