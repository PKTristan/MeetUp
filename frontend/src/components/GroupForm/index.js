// /frontend/src/components/GroupForm/index.js
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createGroup } from "../../store/groups";
import { clearGroups, CLEAR_OPTIONS_GROUPS } from "../../store/groups";


const GroupForm = ({ groupDetails }) => {
    const dispatch = useDispatch();
    const newId = useSelector(state => state.groups.newId);
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('In Person');
    const [isPrivate, setIsPrivate] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [isUrlValid, setIsUrlValid] = useState(false);
    const [disabled, setDisabled] = useState(true);


    // eslint-disable-next-line
    const validateInput = useCallback(() => {
        let mutErr = Array.from(errors);
        const locValid = (location.match(/.+[,]\s../)) ? true : false;
        const nameValid = (name.length > 2);
        const descValid = (description.length > 50);
        const locationMsg = "Location must have format: 'Ventura, CA'";
        const nameMsg = "Name must be at least 2 characters";
        const descMsg = "Description must be at least 50 characters";
        const urlMsg = "Must be valid url: https://example.com/image.png";
        mutErr = mutErr.filter((error) => ((error !== locationMsg) && (error !== nameMsg) && (error !== descMsg) && (error !== urlMsg)));

        if (!locValid || !nameValid || !descValid || !isUrlValid) {
            if (!disabled) setDisabled(true);

            if (!locValid) mutErr.push(locationMsg);
            if (!nameValid) mutErr.push(nameMsg);
            if (!descValid) mutErr.push(descMsg);
            if (!isUrlValid) mutErr.push(urlMsg);
        }
        else {
            setDisabled(false);
        }

        setErrors(mutErr);
    }, [location, name, description, isUrlValid, setDisabled, disabled]);

    useEffect(() => validateInput(), [location, name, description, imageUrl, validateInput]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const [city, state] = location.split(', ');

        const newGroup = {
            city,
            state,
            name,
            about: description,
            type,
            private: isPrivate
        };

        dispatch(createGroup(newGroup, imageUrl)).catch(async (res) => {
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
            case 'location':
                setLocation(value);
                break;

            case 'name':
                setName(value);
                break;

            case 'description':
                setDescription(value);
                break;

            case "select-type":
                setType(value);
                break;

            case "select-private":
                setIsPrivate(value);
                break;

            case "add-image":
                setImageUrl(value);
                setIsUrlValid(e.target.validity.valid);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        if (groupDetails) {
            setLocation(groupDetails.location);
            setName(groupDetails.name);
            setDescription(groupDetails.description);
        }
    }, [groupDetails]);

    useEffect(() => {
        if (newId) {
            history.push(`/groups/${newId}`);
        }

        return () => dispatch(clearGroups([CLEAR_OPTIONS_GROUPS.newId]));
    }, [history, newId, dispatch]);


    return (
        <div className="div-group-form">
            <form onSubmit={handleSubmit}>

                <ul >
                    {errors.map((error, idx) => <li className="error" key={idx}>{error}</li>)}
                </ul>

                <div className="location">
                    <h4>Set your group's location.</h4>
                    <p>
                        Meetup groups meet locally, in person, and online. We'll connect you with people in your area.
                    </p>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        placeholder="City, STATE"
                        value={location}
                        onChange={onChange}
                    />
                </div>

                <div className="name">
                    <h4>What will your group's name be?</h4>
                    <p>
                        Choose a name that will give people a clear idea of what the group is about.
                        Feel free to get creative!
                        You can edit this later if you change your mind.
                    </p>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="What is your group name?"
                        value={name}
                        onChange={onChange}
                    />
                </div>

                <div className="description">
                    <h4>Describe the prupose of your group.</h4>
                    <p>
                        People will see this when we promote your group,
                        but you'll be able to add to it later, too.
                        1. What's the purpose of the group?
                        2. Who should join?
                        3. What will you do at your events?
                    </p>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="Please write at least 50 characters"
                        value={description}
                        onChange={onChange}
                    />
                </div>

                <div className="section4">
                    <label htmlFor="select-type">Is this an in-person or online group?</label>
                    <select name="select-type" id="select-type" value={type} onChange={onChange}>
                        <option >In Person</option>
                        <option >Online</option>
                    </select>

                    <label htmlFor="select-private">Is this group private or public?</label>
                    <select name="select-private" id="select-private" value={isPrivate} onChange={onChange}>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                    </select>

                    <label htmlFor='add-image'>Please add an image URL foryour group below:</label>
                    <input type="url" name="add-image" id="add-image" value={imageUrl} onChange={onChange} required={true} />
                </div>

                <button type="submit" disabled={disabled}>Create Group</button>

            </form>
        </div>
    );
};

export default GroupForm;
