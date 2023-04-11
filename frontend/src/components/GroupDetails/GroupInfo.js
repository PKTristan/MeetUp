import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { groupDetailsSelector } from "../../store/groups";
import { currentUserSelector } from "../../store/session";
import Delete from "../Delete";
import InterimModal from "../Modal";

const GroupInfo = () => {
    const group = useSelector(groupDetailsSelector);
    const user = useSelector(currentUserSelector);
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

    const isUserOrganizer = (id) => (user && id === user.id);

    return (
        <>
            { isLoaded ?
                < div className="group-details" >
                    <div className='div-image-group-info'>
                        <img src={(group.GroupImages.length > 0) ? group.GroupImages[0].url : ""} alt="Group" />

                        <div className="group-info">
                            <h2>{group.name}</h2>
                            <h4>{group.city}, {group.state}</h4>
                            <h4>{group.numMembers} members &#183; {(group.private) ? 'Private' : 'Public'}</h4>
                            <h4>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</h4>

                            <button className='logged-in-button' hidden={!isUserOrganizer(group.Organizer.id)} onClick={handleJoinClick}>Create event</button>
                            <button className='logged-in-button' hidden={!isUserOrganizer(group.Organizer.id)} onClick={handleJoinClick}>Update</button>
                            <InterimModal Component={Delete} buttonLabel="Delete" buttonClass='logged-in-button' isHidden={!isUserOrganizer(group.Organizer.id)} params={{itemName: "group", id: group.id}} />
                            <button className="join-group" hidden={isUserOrganizer(group.Organizer.id)} onClick={handleJoinClick}>Join this group</button>
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
