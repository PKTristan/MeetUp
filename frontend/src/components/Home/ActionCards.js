import { NavLink } from "react-router-dom";

const ActionCards = ({ paragraphs }) => {

    const style = {
        textDecoration: "none"
    };


    return (
        <div className="action-cards">
            <div className="card">
                <img src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256" alt='high five'></img>
                <NavLink to='/groups' style={style}><h3>See all groups</h3></NavLink>
                <p>{paragraphs[2]}</p>
            </div>
            <div className="card">
                <img src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256" alt='event ticket'></img>
                <NavLink to='/events' style={style}><h3>Find an event</h3></NavLink>
                <p>{paragraphs[3]}</p>
            </div>
            <div className="card">
                <img src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256" alt='group icon'></img>
                <NavLink to='/groups/new' style={style}><h3>Start a new group</h3></NavLink>
                <p>{paragraphs[4]}</p>
            </div>
        </div>
    );
};

export default ActionCards;
