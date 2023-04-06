import './Home.css';

const About = ({ paragraphs }) => {


    return (
        <section className="section1">
            <div className="div-left">
                <h1>The people platform- Where interests become friendships</h1>
                <p>{paragraphs[0]}</p>
            </div>
            <div className="div-right">
                <img src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640' alt='im not sure'></img>
            </div>
        </section>
    );
};

export default About;
