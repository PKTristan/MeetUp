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
        <div className="div-signup-form" >
            <h1>Sign up</h1>
            <section className="signup-form">
                <form onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <div className="form-group firstname">
                        <input type="text" placeholder="first name" name="firstName" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="form-group lastname">
                        <input type="text" placeholder="last name" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="form-group email">
                        <input type="email" placeholder="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group username">
                        <input type="text" placeholder="username" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-group password">
                        <input type="password" placeholder="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="button-container">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default SignupFormPage;
