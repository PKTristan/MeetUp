import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import Groups from "./components/Groups";
import { currentUser } from "./store/session";
import { useDispatch } from "react-redux";
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import GroupDetails from "./components/GroupDetails";
import Home from "./components/Home";
import Modal from 'react-modal';
import { getAllGroups, clearGroups, CLEAR_OPTIONS_GROUPS } from "./store/groups";
import { clearEvents, getEvents, CLEAR_OPTIONS_EVENTS } from "./store/events";


Modal.setAppElement('#root');


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUser());
    dispatch(getAllGroups());
    dispatch(getEvents());

    return () => {
      dispatch(clearGroups([CLEAR_OPTIONS_GROUPS.all]));
      dispatch(clearEvents([CLEAR_OPTIONS_EVENTS.all]));
    };
  }, [dispatch]);


  return (
    <>
      <Navigation />
      <div className="app-routes">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={LoginFormPage} />
          <Route exact path="/signup" component={SignupFormPage} />
          <Route exact path="/groups" component={Groups} />
          <Route exact path="/groups/:id" component={GroupDetails} />
        </Switch>
      </div>
    </>
  );
}

export default App;
