import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { groupDetailsSelector } from "../../store/groups";

const GroupInfo = () => {
    const group = useSelector(groupDetailsSelector);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (group) {
            setIsLoaded(true);
        }
        else {
            setIsLoaded(false);
        }

    }, [group]);

    const handleJoinClick = (e) => {
        e.preventDefault();

        alert("Feature being added soon!");
    };


    return (
        <div className="group-details">
            { isLoaded ?
                <div className='div-image-group-info'>
                    <img src={(group.GroupImages.length > 0) ? group.GroupImages[0].url : ""} alt="Group" />

                    <div className="group-info">
                        <h2>{group.name}</h2>
                        <h4>{group.city}, {group.state}</h4>
                        <h4>{group.numMembers} members - - - {group.type}</h4>
                        <h4>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h4>

                        <button className="join-group" onClick={handleJoinClick}>Join this group</button>
                    </div>
                </div>
                : <h1>Loading...</h1>
            }
        </div>
    );
};

export default GroupInfo;
