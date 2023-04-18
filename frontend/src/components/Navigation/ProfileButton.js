// /frontend/src/components/ProfileButton.js

//a react functional component that rendersa generic profile icon from Font Awesome
import React, { useState} from "react";
import ProfileList from "./ProfileList";
import InterimModal from "../Modal";

const ProfileButton = () => {
    const [dropdown, setDropdown] = useState(false);

    const iconClick = (e) => {
        e.preventDefault();

        if (dropdown) return;
        setDropdown(true);
    };


    return (
        <>
            <button type='button' className="prof-butt" onClick={iconClick} >
                <i className="fa-solid fa-user" />
            </button>
            <ProfileList args={{dropdown, setDropdown}}/>
        </>
    );

};


export default ProfileButton;
