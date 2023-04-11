// /frontend/src/components/Navigation/index.js
import ProfileButton from "./ProfileButton";
import './Navigation.css';
import meetupLogo from '../../assets/meetup-logo.png';
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { currentUserSelector } from "../../store/session";

const Navigation = () => {
    const currentUser = useSelector(currentUserSelector);

    const style = {textDecoration: "none", color: "teal"};

    return (
        <div className="nav-bar">
            <NavLink to="/"><img className="corner-logo" src={meetupLogo} alt="Meetup logo" /></NavLink>
            <div className="nav-bar-links">
                { currentUser && <NavLink to="/groups/new" style={style}><p>Start a new group</p></NavLink> }
            </div>
            <ul className="nav-prof-button">
                <ProfileButton />
            </ul>
        </div>
    );

};

export default Navigation;
