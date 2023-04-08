// /frontend/src/components/Groups/index.js
import NavTab from "../NavTab";
import GroupList from "./GroupList";


const Groups = () => {

    return (
        <div className="groups-wrapper" >
            <NavTab />
            <GroupList />
        </div>
    )
};

export default Groups;
