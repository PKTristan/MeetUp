// frontend/src/components/Events/EventList.js
import { useSelector, useDispatch } from "react-redux";
import { getEventsByGroup, allEventsSelector, groupEventsSelector, clearEvents, CLEAR_OPTIONS_EVENTS } from "../../store/events";
import { useEffect, useState } from "react";


const EventList = ({groupId}) => {
    const dispatch = useDispatch();
    const allEvents = useSelector(allEventsSelector);
    const groupEvents = useSelector(groupEventsSelector);
    const [eventsArr, setEventsArr] = useState([]);

    useEffect(() => {
        if (groupId !== undefined) {
            dispatch(getEventsByGroup(groupId));

            return  () => dispatch(clearEvents([CLEAR_OPTIONS_EVENTS.groups]));
        }
    }, [dispatch, groupId]);


    useEffect(() => {
        if (groupEvents) {
            setEventsArr(Object.values(groupEvents));
        } else {
            setEventsArr(Object.values(allEvents));
        }
    }, [groupEvents, allEvents]);

    return (
        <div className="event-list">

        </div>
    );
};


export default EventList;
