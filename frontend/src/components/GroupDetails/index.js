// /frontend/src/components/GroupDetails/index.js
import { getGroupDetails } from "../../store/groups";
import { useParams } from "react-router-dom";
import {  useDispatch } from "react-redux";
import  { useEffect } from "react";
import { NavLink } from "react-router-dom";
import GroupInfo from "./GroupInfo";


const GroupDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getGroupDetails(id));
    }, [id, dispatch]);


    return (
        <div className="group-details">
            <p>{"< "} <NavLink to="/groups">Groups</NavLink></p>
            <GroupInfo />
        </div>
    )
}

export default GroupDetails;
