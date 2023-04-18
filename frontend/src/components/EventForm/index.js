// /frontend/src/components/EventForm/index.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { createEvent, selNewId, CLEAR_OPTIONS_EVENTS, clearEvents } from "../../store/events";
import { useParams, useHistory } from "react-router-dom";
import { getGroupDetails, groupDetailsSelector } from "../../store/groups";
import './EventForm.css';



const EventForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const newId = useSelector(selNewId);
    const group = useSelector(groupDetailsSelector);
    const [name, setName] = useState("");
    const [type, setType] = useState("In Person");
    const [capacity, setCapacity] = useState(1);
    const [price, setPrice] = useState(Number(0).toFixed(2));
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [urlValid, setUrlValid] = useState(false);
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(true);

    const validateInput = useCallback(() => {
        let mutErr = Array.from(errors);
        const nameVal = (name && name.length > 2);
        const capVal = (capacity && capacity > 0);
        const startVal = (start && (new Date(start) > Date.now()));
        const endVal = (end && start && (new Date(end) > new Date(start)));
        const descVal = (description && description.length > 30);
        const nameMsg = "Name must be at least 2 characters";
        const startMsg = "Start date has to be a future date";
        const endMsg = "End date has to come after start date";
        const descMsg = "Description must be at least 30 characters";
        const urlMsg = "Must be valid url: https://example.com/image.png";
        const capMsg = "Capacity cannot be negative";

        mutErr = mutErr.filter((error) => ((error !== capMsg) && (error !== startMsg) && (error !== nameMsg) && (error !== descMsg) && (error !== urlMsg) && (error !== endMsg)));

        if (!nameVal || !startVal || !endVal || !descVal || !urlValid || !capVal) {
            if (!disabled) setDisabled(true);


            if (!nameVal) mutErr.push(nameMsg);
            if (!descVal) mutErr.push(descMsg);
            if (!urlValid) mutErr.push(urlMsg);
            if (!startVal) mutErr.push(startMsg);
            if (!endVal) mutErr.push(endMsg);
            if (!capVal) mutErr.push(capMsg);
        }
        else {
            setDisabled(false);
        }

        setErrors(mutErr);

    }, [name, price, start, end, urlValid, capacity, description]);

    useEffect(() => validateInput(), [name, price, start, end, imgUrl, description, validateInput]);


    const handleOnSubmit = (e) => {
        e.preventDefault();
        const venueId = (group.Venue) ? group.Venue.id : 1;

        const body = {
            venueId,
            name,
            type,
            price,
            startDate: new Date(start),
            endDate: new Date(end),
            description,
            capacity
        };

        dispatch(createEvent(body, id, imgUrl)).catch(async (res) => {
            console.log(res);
            const data = await res.json();
            if (data && data.errors) {
                const err = Object.values(data.errors);
                setErrors(err);
            }
        });
    };

    const onChange = (e) => {
        e.preventDefault();
        const value = e.target.value;

        switch (e.target.name) {
            case "name":
                setName(value);
                break;

            case "type":
                setType(value);
                break;

            case "capacity":
                setCapacity(Math.round(value));
                break;

            case "price-input":
                setPrice(Number(value).toFixed(2));
                break;

            case "date-time-start":
                setStart(value);
                break;

            case "date-time-end":
                setEnd(value);
                break;

            case "add-image":
                setImgUrl(value);
                setUrlValid(e.target.validity.valid);
                break;

            case "description":
                setDescription(value);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        dispatch(getGroupDetails(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (newId) {
            history.push(`/events/${newId}`);
        }

        return () =>  dispatch(clearEvents([CLEAR_OPTIONS_EVENTS.newId]));
    }, [newId, history]);

    return (
        <div className="event-form">
            <form onSubmit={handleOnSubmit}>
                <h1>Create an event for {(group) ? group.name : "Loading..."}</h1>

                <ul >
                    {errors.map((error, idx) => <li className="error" key={idx}>{error}</li>)}
                </ul>

                <div className="section1">
                    <label htmlFor="name">What is the name of your event?</label>
                    <input type="text" name="name" id="name" value={name} onChange={onChange} />
                </div>

                <div className="section2">
                    <label htmlFor="type">Is this an in person, or online event?</label>
                    <select name="type" id="type" value={type} onChange={onChange}>
                        <option value="In Person">In Person</option>
                        <option value="Online">Online</option>
                    </select>

                    <label htmlFor="capacity">How many persons are allowed to attend your event?</label>
                    <input type="number" name="capacity" id="capacity" min={0} value={capacity} onChange={onChange} />

                    <label htmlFor="price">What is the price of your event?</label>
                    <span>$ <input type="number" name="price-input" id="price-input" min={0} value={price} onChange={onChange} /></span>
                </div>

                <div className="section3">
                    <label htmlFor="date-time-start">When does your event start?</label>
                    <input type="datetime-local" name="date-time-start" id="date-time-start" value={start} onChange={onChange} />

                    <label htmlFor="date-time-end">When does your event end?</label>
                    <input type="datetime-local" name="date-time-end" id="date-time-end" value={end} onChange={onChange} />
                </div>

                <div className="section4">
                    <label htmlFor="add-image">Please add in image url for your event below.</label>
                    <input type="url" name="add-image" id="add-image" value={imgUrl} onChange={onChange} />
                </div>

                <div className="section5">
                    <label htmlFor="description">Please describe your event:</label>
                    <textarea name="description" id="description" value={description} onChange={onChange} />
                </div>

                <button type="submit" disabled={disabled}>Create Event</button>
            </form>
        </div>
    )
};

export default EventForm;
