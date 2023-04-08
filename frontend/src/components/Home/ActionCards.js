import { NavLink } from "react-router-dom";

const ActionCards = ({ paragraphs }) => {


    return (
        <div className="action-cards">
            <div className="card">
                <img src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256" alt='high five'></img>
                <h3><NavLink to='/groups'>See all groups</NavLink></h3>
                <p>{paragraphs[2]}</p>
            </div>
            <div className="card">
                <img src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256" alt='event ticket'></img>
                <h3>Find an event</h3>
                <p>{paragraphs[3]}</p>
            </div>
            <div className="card">
                <img src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256" alt='group icon'></img>
                <h3>Start a new group</h3>
                <p>{paragraphs[4]}</p>
            </div>
        </div>
    );
};

export default ActionCards;
