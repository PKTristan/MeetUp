// /frontend/src/components/Groups/GroupList.js
import { useSelector } from "react-redux";
import { allGroupsSelector } from "../../store/groups.js";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


const GroupList = () => {
    const history = useHistory();
    const allGroups = useSelector(allGroupsSelector);
    const [allGroupsArr, setAllGroupsArr] = useState([]);

    useEffect(() => {
        if (allGroups !== null) {
            setAllGroupsArr(Object.values(allGroups));
        }
    }, [allGroups]);

    return (
        <div className="group-list" >
            {
                allGroupsArr.map(group => {
                    return (
                        <div className="group-list-item" key={group.id} onClick={() => history.push(`/groups/${group.id}`)}>
                            <div className="div-img">
                                <img className="group-img" src={group.previewImage} alt={group.name} />
                            </div>
                            <div className="group-info">
                                <h2 className="group-name">{group.name}</h2>
                                <h3 className="group-location">{group.city + ", " + group.state}</h3>
                                <p className="group-about">{group.about}</p>
                                <h3 className="group-members-type"> {group.numMembers + " members - - - " + group.type}</h3>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    )
};


export default GroupList;
