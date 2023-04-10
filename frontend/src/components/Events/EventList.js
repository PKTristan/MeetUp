// frontend/src/components/Events/EventList.js
import { useSelector, useDispatch } from "react-redux";
import { getEventsByGroup, allEventsSelector, groupEventsSelector, clearEvents, CLEAR_OPTIONS_EVENTS } from "../../store/events";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";


const EventList = ({ groupId }) => {
    const dispatch = useDispatch();
    const allEvents = useSelector(allEventsSelector);
    const groupEvents = useSelector(groupEventsSelector);
    const [futureEvents, setFutureEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [ongoingEvents, setOngoingEvents] = useState([]);


    //separates and orders events
    const setEventLists = (events) => {
        const currTime = new Date().getTime();


        const sortEvents = (a, b) => {
            const aTime = new Date(a.startDate).getTime();
            const bTime = new Date(b.startDate).getTime();

            if (aTime < bTime) {
                return -1;
            }

            if (aTime > bTime) {
                return 1;
            }

            return 0;
        };

        setFutureEvents(events.filter(event => new Date(event.startDate).getTime() > currTime).sort(sortEvents));

        setOngoingEvents(events.filter((event) => {
            return (new Date(event.startDate).getTime() < currTime) && (new Date(event.endDate).getTime() > currTime);
        }).sort(sortEvents));

        setPastEvents(events.filter(event => new Date(event.endDate).getTime() < currTime).sort(sortEvents));
    };

    useEffect(() => {
        if (groupId !== undefined) {
            dispatch(getEventsByGroup(groupId));

            return () => dispatch(clearEvents([CLEAR_OPTIONS_EVENTS.groups]));
        }
    }, [dispatch, groupId]);


    useEffect(() => {
        if (groupEvents) {
            setEventLists(Object.values(groupEvents))
        } else if (allEvents) {
            setEventLists(Object.values(allEvents));
        }
    }, [groupEvents, allEvents]);

    return (
        <div className="event-list">
            {
                (ongoingEvents.length > 0) && (
                    <div className="ongoing-events">
                        <h2>Ongoing Events ({ongoingEvents.length})</h2>
                        {
                            ongoingEvents.map(event => <EventCard event={event} key={event.id} />)
                        }
                    </div>
                )
            }
            {
                (futureEvents.length > 0) && (
                    <div className="future-events">
                        <h2>Future Events ({futureEvents.length})</h2>
                        {
                            futureEvents.map(event => <EventCard event={event} key={event.id} />)
                        }
                    </div>
                )
            }
            {
                (pastEvents.length > 0) && (
                    <div className="past-events">
                        <h2>Past Events ({pastEvents.length})</h2>
                        {
                            pastEvents.map(event => <EventCard event={event} key={event.id} />)
                        }
                    </div>
                )

            }
        </div>
    );
};


export default EventList;
