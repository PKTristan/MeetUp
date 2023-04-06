//frontend/src/components/LoginFormPage/index.js

import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";

const SignupFormPage = () => {
const dispatch = useDispatch();
const history = useHistory();
const user = useSelector(sessionActions.userSelector);

const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState([]);

const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
        firstName,
        lastName,
        username,
        email,
        password
    };

    dispatch(sessionActions.signup(body))
        .catch((res) => {
            const data = res.json();
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

    return (
        <div>
            <h1>Signup Form Page</h1>
            <section className="signup-form">
                <form onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <div className="form-group firstname">
                        <label htmlFor="firstName">First Name: </label>
                        <input type="text" name="firstName" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="form-group lastname">
                        <label htmlFor="lastName">Last Name: </label>
                        <input type="text" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="form-group email">
                        <label htmlFor="email">Email: </label>
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group username">
                        <label htmlFor="username">Username: </label>
                        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group password">
                        <label htmlFor="password">Password: </label>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit">Sign Up</button>
                    <button type="button" onClick={() => history.push('/login')}>Login</button>
                </form>
            </section>
        </div>
    );
};

export default SignupFormPage;
