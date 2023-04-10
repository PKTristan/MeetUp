// /frontend/src/components/Events/EventCard.js
import { useState, useEffect } from "react";

const EventCard = ({ event }) => {
const [date, setDate] = useState('');
const [time, setTime] = useState('');

useEffect(() => {
    const dateArr = event.startDate.split(/T|\./);

    setDate(dateArr[0]);
    setTime(dateArr[1]);
}, [event]);


    return (
        <div className="event-card">
            <div className="event-card-top">
                <img src={event.previewImage} alt={event.name} />
                <div className="event-card-info">
                    <label className="event-date">{date} &#183; {time}</label>
                    <h3 className='event-title'>{event.name}</h3>
                    <label className='event-location'>{event.Venue.city}, {event.Venue.state}</label>
                </div>
            </div>
            <div className="event-card-bottom">
                <p>{event.description}</p>
            </div>

        </div>
    );
};

export default EventCard;
