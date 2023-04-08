// /frontend/src/components/Groups/GroupTab.js
import { NavLink } from "react-router-dom";

const NavTab = () => {


    return (
        <div className="nav-tab">
            <div className="event-nav-tab">
                <NavLink to="/events">Events</NavLink>
            </div>
            <div className="group-nav-tab">
                <NavLink to="/groups">Groups</NavLink>
            </div>
        </div>
    )
};

export default NavTab;
