//frontend/src/components/LoginFormPage/index.js

import { useHistory } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

const SignupFormPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(sessionActions.currentUserSelector);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(false);

    const validateInput = useCallback(() => {
        let mutErr = Array.from(errors);
        const firstVal = (firstName && firstName.length >= 2);
        const lastVal = (lastName && lastName.length >= 2);
        const usernameVal = (username && username.length >= 4);
        const passVal = (password && password.length >= 6);
        const confPassVal = (confirmPass && password === confirmPass);
        const firstMsg = "First name must be at least 2 characters";
        const lastMsg = "Last name must be at least 2 characters";
        const usernameMsg = "Username must be at least 4 characters";
        const passMsg = "Password must be at least 6 characters";
        const emailMsg = "Email must be valid. Example: uxOe1@example.com";
        const confirmPassMsg = "Passwords do not match";

        mutErr = mutErr.filter((error) => ((error !== firstMsg) && (error !== passMsg) && (error !== lastMsg) && (error !== usernameMsg) && (error !== emailMsg) && (error !== confirmPassMsg)));

        if (!firstVal || !passVal || !lastVal || !usernameVal || !emailValid || !confPassVal) {
            if (!disabled) setDisabled(true);

            if (!firstVal) mutErr.push(firstMsg);
            if (!passVal) mutErr.push(passMsg);
            if (!lastVal) mutErr.push(lastMsg);
            if (!usernameVal) mutErr.push(usernameMsg);
            if (!emailValid) mutErr.push(emailMsg);
            if (!confPassVal) mutErr.push(confirmPassMsg);
        }
        else {
            setDisabled(false);
        }

        setErrors(mutErr);
    }, [firstName, lastName, username, emailValid, password, confirmPass]);

    useEffect(() => validateInput(), [firstName, lastName, username, emailValid, password, confirmPass, validateInput]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = {
            firstName,
            lastName,
            username,
            email,
            password
        };

        dispatch(sessionActions.signup(body)).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                const err = Object.values(data.errors);
                setErrors(err);
            }
        });
    };

    useEffect(() => {
        if (user) {
            history.push('/');
        }
    }, [user, history]);

    const changeEmail = (e) => {
        e.preventDefault();

        setEmail(e.target.value);
        setEmailValid(e.target.validity.valid);

    }


    return (
        <div className="div-signup-form" >
            <h1>Sign up</h1>
            <section className="signup-form">
                <form onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li className="error" key={idx}>{error}</li>)}
                    </ul>
                    <div className="form-group firstname">
                        <input type="text" placeholder="first name" name="firstName" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="form-group lastname">
                        <input type="text" placeholder="last name" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="form-group email">
                        <input type="email" placeholder="email" name="email" id="email" value={email} onChange={changeEmail} />
                    </div>
                    <div className="form-group username">
                        <input type="text" placeholder="username" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group password">
                        <input type="password" placeholder="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group password-confirm">
                        <input type="password" placeholder="confirm password" name="password" id="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                    </div>
                    <div className="button-container">
                        <button disabled={disabled} type="submit">Sign Up</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default SignupFormPage;
