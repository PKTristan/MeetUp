// /frontend/src/components/Groups/index.js
import NavTab from "../NavTab";
import GroupList from "./GroupList";


const Groups = () => {

    return (
        <div className="groups-wrapper" >
            <NavTab />
            <h3>Groups in Meetup</h3>
            <GroupList />
        </div>
    )
};

export default Groups;
