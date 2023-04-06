// /frontend/src/components/ProfileButton.js

//a react functional component that rendersa generic profile icon from Font Awesome
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

const ProfileButton = ({user}) => {
    const dispatch = useDispatch();

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };


    return (
        <>
            <button type='button'>
                <i className="fa-regular fa-face-smile" />
            </button>
            <ul className="profile-dropdown" >
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
