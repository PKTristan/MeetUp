// /frontend/src/components/Groups/GroupTab.js
import { NavLink } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import './NavTab.css';

const NavTab = ({name}) => {

    const matchEvents = useRouteMatch("/events");
    const matchGroups = useRouteMatch("/groups");

    const style = (isActive) => ({
        textDecoration: isActive ? "underline" : "none",
        color: isActive ? "teal" : "black",
        cursor: isActive ? "default" : "pointer"
    });

    return (
        <div className="nav-tab">
            <div className="links">
            <div className="event-nav-tab">
                <NavLink to="/events" style={style}>Events</NavLink>
            </div>
            <div className="group-nav-tab">
                <NavLink to="/groups" style={style}>Groups</NavLink>
            </div>
            </div>
            <p>{name} in Meetup</p>
        </div>
    )
};

export default NavTab;
