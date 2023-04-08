import * as sessionActions from '../../store/session';
import { useDispatch, useSelector} from 'react-redux';
import { useRef, useEffect } from 'react';
import InterimModal from '../Modal';
import LoginFormPage from '../LoginFormPage';
import SignupFormPage from '../SignupFormPage';
import { useHistory } from 'react-router-dom';


const ProfileList = ({ args: { dropdown, setDropdown }}) => {
    const ref = useRef();
    const user = useSelector(sessionActions.currentUserSelector);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const handleHome = (e) => {
        e.preventDefault();

        history.push('/');
    }

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
    }, [ref, dropdown, setDropdown]);


    if (!user) {
        return (
            <div className="profile-list">
                <ul className={ulClassName} ref={ref} >
                    <li>
                        <button type='button' onClick={handleHome}>Home</button>
                    </li>
                    <li>
                        <InterimModal Component={LoginFormPage} buttonLabel="Login" />
                    </li>
                    <li>
                        <InterimModal Component={SignupFormPage} buttonLabel="Signup" />
                    </li>
                </ul>
            </div>
        );
    }
    else {
        return (
            <div className="profile-list">
                <ul className={ulClassName} ref={ref} >
                    <li>{user.username}</li>
                    <li>{user.firstName} {user.lastName}</li>
                    <li>{user.email}</li>
                    <li>
                        <button type='button' onClick={handleHome}>Home</button>
                    </li>
                    <li>
                        <button type='button' onClick={handleLogout}>Log Out</button>
                    </li>

                </ul>
            </div>
        );
    }

};

export default ProfileList;
