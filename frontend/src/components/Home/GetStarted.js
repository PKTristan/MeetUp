import ActionCards from "./ActionCards";
import { useHistory } from "react-router-dom";
import InterimModal from "../Modal";
import SignupFormPage from "../SignupFormPage";

const GetStarted = ({paragraphs}) => {
    const history = useHistory();

    return (
        <section className="section2">
            <h2>How Meetup works</h2>
            <p>{paragraphs[1]}</p>
            <ActionCards paragraphs={paragraphs} />
            <InterimModal Component={SignupFormPage} bName="Sign up" />
        </section>
    );
};

export default GetStarted;
