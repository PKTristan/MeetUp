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
        <>
            { isLoaded ?
                < div className="group-details" >
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
                    <div className="group-about">
                        <h2>Organizer</h2>
                        <h4>{group.Organizer.firstName} {group.Organizer.lastName}</h4>
                        <h2>What we're about</h2>
                        <p>{group.about}</p>
                    </div>
                </div >
                : <h1>Loading . . .</h1>
            }
        </>
    );
};

export default GroupInfo;
