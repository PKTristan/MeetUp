// /frontend/src/components/Events/index.js
import NavTab from "../NavTab";
import EventList from "./EventList";


const Events = () => {

    return (
        <div className="events-wrapper" >
            <NavTab />
            <EventList />
        </div>
    )
};

export default Events;
