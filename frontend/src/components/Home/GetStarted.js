import ActionCards from "./ActionCards";
import { useHistory } from "react-router-dom";

const GetStarted = ({paragraphs}) => {
    const history = useHistory();

    return (
        <section className="section2">
            <h2>How Meetup works</h2>
            <p>{paragraphs[1]}</p>
            <ActionCards paragraphs={paragraphs} />
            <button type="button" onClick={() => history.push('/signup')} >Join Meetup</button>
        </section>
    );
};

export default GetStarted;
