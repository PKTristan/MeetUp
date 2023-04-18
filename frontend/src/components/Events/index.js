// /frontend/src/components/Events/index.js
import NavTab from "../NavTab";
import EventList from "./EventList";
import './Events.css';


const Events = () => {

    return (
        <div className="events-wrapper" >
            <NavTab name="Events" />
            <EventList />
        </div>
    )
};

export default Events;
