// frontend/src/components/LoginFormPage/index.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login, userSelector } from "../../store/session";
import InterimModal from "../Modal";
import SignupFormPage from "../SignupFormPage";
import './LoginForm.css';


const LoginFormPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(userSelector);

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const updateCredential = (e) => setCredential(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        const user = {
            credential,
            password
        };

        return dispatch(login(user)).catch(async (res) => {
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


    return (
        <div className="div-login-form">
            <h1>Log in</h1>
            <section className="login-form">
                <form onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <div className="form-group credential">
                        <input type="text" name="credential" id="credential" placeholder="username or email" value={credential} onChange={updateCredential} />
                    </div>
                    <div className="form-group password">
                        <input type="password" name="password" id="password" placeholder="password" value={password} onChange={updatePassword} />
                    </div>
                    <div className="button-container">
                        <button type="submit">Login</button>
                        <InterimModal Component={SignupFormPage} buttonLabel="Sign up"/>
                    </div>
                </form>
            </section>
        </div>
    );
};


export default LoginFormPage;
