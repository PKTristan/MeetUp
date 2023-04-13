// /frontend/src/store/groups
import { csrfFetch } from "./csrf";
import normalizeData from "./normalizeData";

export const CLEAR_OPTIONS_GROUPS = {
    all: 'allGroups',
    details: 'groupDetails',
    newId: 'newId'
};

const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const LOAD_GROUP_DETAILS = 'groups/LOAD_GROUP_DETAILS';
export const CLEAR_GROUPS = 'groups/CLEAR_GROUPS';
const NEW_ID = 'groups/NEW_ID';

// action creators

//action creator to load groups
export const loadGroups = (groups) => ({
    type: LOAD_GROUPS,
    groups
});

export const clearGroups = (options = [], id) => ({
    type: CLEAR_GROUPS,
    options,
    id
});

//action creator to load specific details of a group
export const loadGroupDetails = (group) => ({
    type: LOAD_GROUP_DETAILS,
    group
});

const newId = (id) => ({
    type: NEW_ID,
    id
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

export const createGroup = (group, url) => async (dispatch) => {
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify(group)
    });



    if (response.ok) {
        const data = await response.json();
        dispatch(addImage({url, preview: true}, data.group.id));
    }

    return response;
}

export const addImage = (body, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        // const data = await response.json();

    }

    dispatch(getAllGroups());
    dispatch(newId(groupId));

    return response;
};

export const deleteGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        // dispatch(deleteOneGroup(id));
        dispatch(getAllGroups());
    }

    return response;
}

export const updateGroup = (id ,group) => async (dispatch) =>{
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify(group)
    });

    if (response.ok) {
        dispatch(newId(id));
    }

    return response;
}



//selectors

export const allGroupsSelector = (state) => state.groups.allGroups;
export const groupDetailsSelector = (state) => state.groups.groupDetails;
export const getGroupById = (id) => (state) => state.groups.allGroups && state.groups.allGroups[id];



//groups reducer
const initialState = { allGroups: null, groupDetails: null, newId: null };

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

        case NEW_ID:
            return {...mutState, newId: action.id};

        // case DELETE_GROUP:
        //     delete mutState.allGroups[action.id];

        //     return {...mutState};

        default:
            return state;
    }
}

export default groupsReducer;
