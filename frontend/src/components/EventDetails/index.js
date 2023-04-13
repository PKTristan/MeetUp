// /frontend/src/components/EventDetails/index.js
import { NavLink, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { groupDetailsSelector, getGroupDetails, clearGroups, CLEAR_OPTIONS_GROUPS } from "../../store/groups";
import { getEventDetails, selEventDetails, clearEvents, CLEAR_OPTIONS_EVENTS } from "../../store/events";
import { useEffect, useState } from "react";


const EventDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const group = useSelector(groupDetailsSelector);
    const event = useSelector(selEventDetails);
    const [timeStart, setTimeStart] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [dateEnd, setDateEnd] = useState("");



    useEffect(() => {
        dispatch(getGroupDetails(id));
        dispatch(getEventDetails(id));

        return () => {
            dispatch(clearGroups([CLEAR_OPTIONS_GROUPS.details]));
            dispatch(clearEvents([CLEAR_OPTIONS_EVENTS.details]));
        }
    }, [dispatch, id]);


    useEffect (() => {
        if (event) {
            const dateArrStart = event.startDate.split(/T|\./);
            const dateArrEnd = event.endDate.split(/T|\./);

            setDateStart(dateArrStart[0]);
            setTimeStart(dateArrStart[1]);
            setTimeEnd(dateArrEnd[1]);
            setDateEnd(dateArrEnd[0]);
        }
    }, [event]);


    return (
        <div className="event-details">
            {
                (group && event) ?
                    (<><div className="events-section-1">
                        <p className="breadCrumb">{"< "} <NavLink to="/events">Events</NavLink></p>
                        <h1>{event.name}</h1>
                        <p>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</p>
                    </div>

                        <div className="events-section-2">
                            <img src={event.previewImage} alt={event.name} />
                            <div className="event-info-box">
                                <div className="group-info" >
                                    <img src={group.previewImage} alt={group.name}></img>
                                    <h4>{group.name}</h4>
                                    <p>{group.city}, {group.state}</p>
                                </div>

                                <div className="start-end">
                                    <i className="fa-regular fa-face-smile" />
                                    <p>START <label  className="date-time">{dateStart} &#183; {timeStart}</label></p>
                                    <p>END <label className="date-time">{dateEnd} &#183; {timeEnd}</label></p>
                                </div>

                                <div className="price">
                                    <i className="fa-regular fa-face-smile" />
                                    <p>{(event.price > 0) ? Number(event.price).toFixed(2) : "Free"}</p>
                                </div>

                                <div className="type">
                                    <i className="fa-regular fa-face-smile" />
                                    <p>{event.type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="events-section-3">
                            <h2>Description</h2>
                            <p>{event.description}</p>
                        </div> </>) : <h1>Loading . . .</h1>
            }
        </div>
    );
}

export default EventDetails;
