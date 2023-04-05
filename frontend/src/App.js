import { useEffect } from "react";
import { NavLink, Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import { logout, currentUser } from "./store/session";
import { useDispatch } from "react-redux";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUser());
  }, []);

  const handleClick = () => {
    dispatch(logout());
  };

  return (
    <Switch>
      <Route exact path="/">
        <h1>Hello from App</h1>
        <NavLink to="/login">Login</NavLink>
        <button type="button" onClick={handleClick}>Logout</button>
      </Route>
      <Route exaxt path="/login" component={LoginFormPage} />
    </Switch>
  );
}

export default App;
