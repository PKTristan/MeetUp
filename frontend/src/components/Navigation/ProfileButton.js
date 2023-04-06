// /frontend/src/components/ProfileButton.js

//a react functional component that rendersa generic profile icon from Font Awesome
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

const ProfileButton = ({user}) => {
    const dispatch = useDispatch();
    const ref = useRef();
    const [dropdown, setDropdown] = useState(false);

    const iconClick = (e) => {
        e.preventDefault();

        if(dropdown) return;
        setDropdown(true);
    };


    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const ulClassName = "profile-dropdown" + (dropdown ? "" : " hidden");

    useEffect(() => {
        if (!dropdown) return;

        const clickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setDropdown(false);
            }
        }

        document.addEventListener("mousedown", clickOutside);

        return () => document.removeEventListener("mousedown", clickOutside);
    }, [ref, dropdown]);



    return (
        <>
            <button type='button' onClick={iconClick} >
                <i className="fa-regular fa-face-smile" />
            </button>
            <ul className={ulClassName} ref={ref} >
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button type='button' onClick={handleLogout}>Log Out</button>
                </li>
            </ul>
        </>
    );
};


export default ProfileButton;
