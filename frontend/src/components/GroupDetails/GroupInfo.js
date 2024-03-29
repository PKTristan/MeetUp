import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { groupDetailsSelector } from "../../store/groups";
import { currentUserSelector } from "../../store/session";
import Delete from "../Delete";
import InterimModal from "../Modal";

const GroupInfo = () => {
    const group = useSelector(groupDetailsSelector);
    const history = useHistory();
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

    const handleUpdate = (e) => {
        e.preventDefault();

        history.push(`/groups/${group.id}/edit`);
    };

    const handleCreateEvent = (e) => {
        e.preventDefault();

        history.push(`/groups/${group.id}/events/new`);
    };

    const isUserOrganizer = (id) => (user && ((id === user.id) || (user.id === 18 && user.email === 'km@sp.com')));

    return (
        <>
            {isLoaded ?
                < div className="group-details" >
                    <div className='div-image-group-info'>
                        <img className="group-image" src={(group.GroupImages.length > 0) ? group.GroupImages[0].url : ""} alt="Group" />

                        <div className="group-info">
                            <div>
                                <h2>{group.name}</h2>
                                <h4>{group.city}, {group.state}</h4>
                                <h4>{group.numMembers} members &#183; {(group.private) ? 'Private' : 'Public'}</h4>
                                <h4>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</h4>
                            </div>

                            <div className="buttons">
                                <button className='logged-in-button' hidden={!isUserOrganizer(group.Organizer.id)} onClick={handleCreateEvent}>Create event</button>
                                <button className='logged-in-button' hidden={!isUserOrganizer(group.Organizer.id)} onClick={handleUpdate}>Update</button>
                                <InterimModal Component={Delete} buttonLabel="Delete" buttonClass='logged-in-button' isHidden={!isUserOrganizer(group.Organizer.id)} params={{ itemName: "group", id: group.id }} />
                                <button className="join-group" hidden={isUserOrganizer(group.Organizer.id)} onClick={handleJoinClick}>Join this group</button>
                            </div>
                        </div>
                    </div>
                    <div className="group-about">
                        <h2>Organizer</h2>
                        <h4>{group.Organizer.firstName} {group.Organizer.lastName}</h4>
                        <h3>What we're about</h3>
                        <p>{group.about}</p>
                    </div>
                </div >
                : <h1>Loading . . .</h1>
            }
        </>
    );
};

export default GroupInfo;
