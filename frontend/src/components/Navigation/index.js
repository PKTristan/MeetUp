// /frontend/src/components/Navigation/index.js
import ProfileButton from "./ProfileButton";
import './Navigation.css';
import meetupLogo from '../../assets/meetup-logo.png';
import { NavLink } from "react-router-dom";

const Navigation = () => {

    return (
        <div>
            <NavLink to="/"><img className="corner-logo" src={meetupLogo} alt="Meetup logo" /></NavLink>
            <ul className="navigation">
                <ProfileButton />
            </ul>
        </div>
    );

};

export default Navigation;
