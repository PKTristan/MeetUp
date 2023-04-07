import ActionCards from "./ActionCards";
import InterimModal from "../Modal";
import SignupFormPage from "../SignupFormPage";

const GetStarted = ({paragraphs}) => {

    return (
        <section className="section2">
            <h2>How Meetup works</h2>
            <p>{paragraphs[1]}</p>
            <ActionCards paragraphs={paragraphs} />
            <InterimModal Component={SignupFormPage} buttonLabel="Sign up" />
        </section>
    );
};

export default GetStarted;
