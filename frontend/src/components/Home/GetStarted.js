import ActionCards from "./ActionCards";
import InterimModal from "../Modal";
import SignupFormPage from "../SignupFormPage";

const GetStarted = ({ paragraphs }) => {

    return (
        <div className="get-started">
            <section className="section2">
                <h2>How Meetup works</h2>
                <p>{paragraphs[1]}</p>
            </section>
            <section className="section3">
                <ActionCards paragraphs={paragraphs} />
            </section>
            <section className="section4">
                <InterimModal Component={SignupFormPage} buttonLabel="Join Meetup" />
            </section>

        </div>
    )
};

export default GetStarted;
