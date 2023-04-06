// frontend/src/components/LoginFormPage/index.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login, userSelector } from "../../store/session";
import './LoginForm.css';


const LoginFormPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(userSelector);

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

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
        <div>
            <h1>Login Form Page</h1>
            <section className="login-form">
                <form onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <div className="form-group credential">
                        <label htmlFor="credential">Username or Email: </label>
                        <input type="text" name="credential" id="credential" value={credential} onChange={updateCredential} />
                    </div>
                    <div className="form-group password">
                        <label htmlFor="password">Password: </label>
                        <input type="password" name="password" id="password" value={password} onChange={updatePassword} />
                    </div>

                    <button type="submit">Login</button>
                    <button type="button" onClick={() => history.push('/signup')}>Signup</button>
                </form>
            </section>
        </div>
    );
};


export default LoginFormPage;
