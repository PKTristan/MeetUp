// /frontend/src/components/Navigation/index.js
import { useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

const Navigation = () => {
    const user = useSelector(sessionActions.userSelector);

    const style = (isActive) => ({

        textDecoration: isActive ? 'underline' : 'none',
    });

    //return a UL that acts as the navigation bar
    if (user) {
        return (
            <div>
                <ul className="navigation">
                    <ProfileButton user={user} />

                    <div><NavLink exact to="/" className="navlink" style={style}> HOME </NavLink></div>
                </ul>
            </div>
        );
    } else {
        return (
            <div>
                <ul className="navigation">
                    <div><NavLink exact to="/" className='navlink' style={style}> HOME </NavLink></div>
                    <div><NavLink to="/signup" className='navlink' style={style}> SIGN UP </NavLink></div>
                    <div><NavLink to="/login" className='navlink' style={style}> LOGIN </NavLink></div>
                </ul>
            </div>
        );
    }
};

export default Navigation;
