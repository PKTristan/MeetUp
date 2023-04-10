// /frontend/src/store/groups
import { csrfFetch } from "./csrf";
import normalizeData from "./normalizeData";

export const CLEAR_OPTIONS_GROUPS = {
    all: 'allGroups',
    details: 'groupDetails'
};

const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const LOAD_GROUP_DETAILS = 'groups/LOAD_GROUP_DETAILS';
export const CLEAR_GROUPS = 'groups/CLEAR_GROUPS';

// action creators

//action creator to load groups
export const loadGroups = (groups) => ({
    type: LOAD_GROUPS,
    groups
});

export const clearGroups = (options = []) => ({
    type: CLEAR_GROUPS,
    options
});

//action creator to load specific details of a group
export const loadGroupDetails = (group) => ({
    type: LOAD_GROUP_DETAILS,
    group
});




//thunk action creator to fetch the /api/groups api
export const getAllGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups');


    if (response.ok) {
        const {Groups: groups} = await response.json();
        dispatch(loadGroups(groups));
    }

    return response;
};


//thunk action creator to fetch the /api/groups/:id api
export const getGroupDetails = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadGroupDetails(data));
    }

    return response;
};

export const createGroup = (group) => async (dispatch) => {
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify(group)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(getGroupDetails(data.group.id));
    }
}



//selectors

export const allGroupsSelector = (state) => state.groups.allGroups;
export const groupDetailsSelector = (state) => state.groups.groupDetails;


//groups reducer
const initialState = { allGroups: null, groupDetails: null};

const groupsReducer = (state = initialState, action) => {
    let mutState = Object.assign(state);

    switch(action.type) {
        case LOAD_GROUPS:
            // mutState.allGroups = normalizeData(action.groups);

            return {...mutState, allGroups: normalizeData(action.groups)};

        case CLEAR_GROUPS:
            action.options.forEach((option) => {
                mutState[option] = null;
            });

            return {...mutState};

        case LOAD_GROUP_DETAILS:
            // mutState.groupDetails = action.group;

        return {...mutState, groupDetails: action.group};

        default:
            return state;
    }
}

export default groupsReducer;
