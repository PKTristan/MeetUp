// /frontend/src/components/GroupDetails/index.js
import { getGroupDetails } from "../../store/groups";
import { useParams } from "react-router-dom";
import {  useDispatch } from "react-redux";
import  { useEffect } from "react";
import { NavLink } from "react-router-dom";
import GroupInfo from "./GroupInfo";
import EventList from "../Events/EventList";
import { clearGroups, CLEAR_OPTIONS_GROUPS } from "../../store/groups";
import './GroupDetails.css';


const GroupDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getGroupDetails(id));

        return () => dispatch(clearGroups([CLEAR_OPTIONS_GROUPS.details]));
    }, [id, dispatch]);




    return (
        <div className="group-details">
            <p>{"< "} <NavLink to="/groups" style={{color: "teal"}}>Groups</NavLink></p>
            <GroupInfo />
            <EventList groupId={{id}}/>
        </div>
    )
}

export default GroupDetails;
