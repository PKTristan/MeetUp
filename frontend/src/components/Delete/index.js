// /frontend/src/components/Delete/index.js

import { useDispatch } from "react-redux";
import { deleteGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { deleteEvent } from "../../store/events";

const Delete = ({params: {itemName, id}, setIsOpen}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);

    const handleYes = (e) => {
        e.preventDefault();

        if (itemName === 'event') {
            dispatch(deleteEvent(id)).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    const err = Object.values(data.errors);
                    setErrors(err);
                }
            });
        } else {
            dispatch(deleteGroup(id)).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    const err = Object.values(data.errors);
                    setErrors(err);
                }
            });
        }

        if (errors.length === 0) {
            history.push(`/${itemName}s`);
        }
    };

    const handleNo = (e) => {
        e.preventDefault();
        setIsOpen(false);
    };


    return (
        <div className='delete-container'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this {itemName}?</p>
            <div className='delete-buttons'>
                <button className='yes-delete' onClick={handleYes}>Yes (Delete {itemName})</button>
                <button className='no-delete' onClick={handleNo}>No (Keep {itemName})</button>
            </div>
        </div>
    );
};

export default Delete;
