// /frontend/src/components/Groups/index.js
import NavTab from "../NavTab";
import GroupList from "./GroupList";
import './Groups.css';


const Groups = () => {

    return (
        <div className="groups-wrapper" >
            <NavTab name="Groups" />
            <GroupList />
        </div>
    )
};

export default Groups;
