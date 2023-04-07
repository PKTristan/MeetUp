// frontend/src/components/LoginFormPage/index.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login, userSelector } from "../../store/session";
import './LoginForm.css';


const LoginFormPage = ({ setModal }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(userSelector);

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(true);

    const updateCredential = (e) => {
        e.preventDefault();
        setCredential(e.target.value);
    };

    const updatePassword = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    };

    const validateInput = () => {
        let mutErr = Array.from(errors);
        const credValid = (credential.length >= 4);
        const passValid = (password.length >= 6);
        const credMsg = 'Credential must be at least 4 characters';
        const passMsg = 'Password must be at least 6 characters';
        mutErr = mutErr.filter((error) => (error !== credMsg) && (error !== passMsg));

        if (!credValid || !passValid) {
            if (!disabled) setDisabled(true);

            if (!credValid) mutErr.push(credMsg);
            if (!passValid) mutErr.push(passMsg);
        }

        setErrors(mutErr);

        if (errors.length === 0) setDisabled(false);
    };

    useEffect(() => validateInput(), [credential, password]);

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
                    <ul >
                        {errors.map((error, idx) => <li className="error" key={idx}>{error}</li>)}
                    </ul>
                    <div className="form-group credential">
                        <input
                            type="text"
                            name="credential"
                            id="credential"
                            placeholder="username or email"
                            value={credential}
                            ononChange={updateCredential}
                        />
                    </div>
                    <div className="form-group password">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="password"
                            value={password}
                            onChange={updatePassword} />
                    </div>
                    <div className="button-container">
                        <button disabled={disabled} type="submit">Login</button>
                    </div>
                </form>
            </section>
        </div>
    );
};


export default LoginFormPage;
