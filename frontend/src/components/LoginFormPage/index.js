// frontend/src/components/LoginFormPage/index.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login, userSelector } from "../../store/session";


const LoginFormPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(userSelector);

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");

    const updateCredential = (e) => setCredential(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            credential,
            password
        };

        dispatch(login(user));

        setPassword("");

        history.push('/');
    };

    useEffect(() => {
        if (user) {
            history.push('/');
        }
    }, []);


    return (
        <div>
            <h1>Login Form Page</h1>
            <section className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group credential">
                        <label htmlFor="credential">Username or Email: </label>
                        <input type="text" name="credential" id="credential" value={credential} onChange={updateCredential} />
                    </div>
                    <div className="form-group password">
                        <label htmlFor="password">Password: </label>
                        <input type="text" name="password" id="password" value={password} onChange={updatePassword} />
                    </div>

                    <button type="submit">Login</button>
                </form>
            </section>
        </div>
    );
};


export default LoginFormPage;
