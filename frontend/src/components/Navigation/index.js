// /frontend/src/components/Navigation/index.js
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";

const Navigation = () => {
    const user = useSelector(sessionActions.userSelector);
    const dispatch = useDispatch();

    //return a UL that acts as the navigation bar
    if (user) {
        return (
            <ul className="navigation">
                <ProfileButton user={user}/>

                <NavLink to="/"> HOME </NavLink>
            </ul>
        );
    } else {
        return (
            <ul className="navigation">
                <NavLink to="/"> HOME </NavLink>
                <NavLink to="/signup"> SIGN UP </NavLink>
                <NavLink to="/login"> LOGIN </NavLink>
            </ul>
        );
    }
};

export default Navigation;
