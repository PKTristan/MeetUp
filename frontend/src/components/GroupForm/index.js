// /frontend/src/components/GroupForm/index.js
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createGroup, updateGroup } from "../../store/groups";
import { clearGroups, CLEAR_OPTIONS_GROUPS } from "../../store/groups";
import './GroupForm.css';



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
        const locValid = (location && location.match(/.+[,]\s../)) ? true : false;
        const nameValid = (name && name.length > 2);
        const descValid = (description && description.length > 50);
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
        if (groupDetails) {
            dispatch(updateGroup(groupDetails.id, newGroup)).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    const err = Object.values(data.errors);
                    setErrors(err);
                }
            });
        } else {

            dispatch(createGroup(newGroup, imageUrl)).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    const err = Object.values(data.errors);
                    setErrors(err);
                }
            });
        }
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
            const url = groupDetails.GroupImages.filter((image) => image.preview);

            setLocation(groupDetails.city + ", " + groupDetails.state);
            setName(groupDetails.name);
            setDescription(groupDetails.about);
            setType(groupDetails.type);
            setIsPrivate(groupDetails.private);
            setImageUrl(url[0].url);
            setIsUrlValid(true);
        }
    }, [groupDetails]);

    useEffect(() => {
        if (newId) {
            history.push(`/groups/${newId}`);
        }

        return () => dispatch(clearGroups([CLEAR_OPTIONS_GROUPS.newId]));
    }, [history, newId, dispatch]);

    const blackText = {
        color: "black"
    };


    return (
        <div className="div-group-form">
            {(groupDetails) ? <h1>Update your group!</h1> : <h1>Start a new group!</h1>}
            <form onSubmit={handleSubmit}>

                <ul  hidden={errors.length < 1}>
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
                    </p>
                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="Please write at least 50 characters"
                        value={description}
                        onChange={onChange}
                    />
                </div>

                <div className="section4">
                    <div>
                        <label htmlFor="select-type" style={blackText}>Is this an in-person or online group?</label>
                        <select name="select-type" id="select-type" value={type} onChange={onChange}>
                            <option >In Person</option>
                            <option >Online</option>
                        </select>

                    </div>

                    <div>
                        <label htmlFor="select-private" style={blackText}>Is this group private or public?</label>
                        <select name="select-private" id="select-private" value={isPrivate} onChange={onChange}>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor='add-image' hidden={groupDetails} style={blackText}>Please add an image URL for your group below:</label>
                        <input type="url" name="add-image" id="add-image" hidden={groupDetails} value={imageUrl} onChange={onChange} required={true} />
                    </div>
                </div>

                <button type="submit" disabled={disabled}>{(groupDetails) ? "Update Group" : "Create Group"}</button>

            </form>
        </div>
    );
};

export default GroupForm;
