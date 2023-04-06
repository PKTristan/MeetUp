import { useEffect, useState } from "react";
import About from "./About";
import GetStarted from "./GetStarted";

const Home = () => {
    const [paragraphs, setParagraphs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://baconipsum.com/api/?type=meat-and-filler');

            const data = await res.json();
            setParagraphs(data);
        };

        fetchData();
    }, []);

    return (
        <div className="div-home">
            <About paragraphs={paragraphs} />
            <GetStarted paragraphs={paragraphs} />
        </div>
    );
}

export default Home;
