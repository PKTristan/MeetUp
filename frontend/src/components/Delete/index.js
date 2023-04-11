// /frontend/src/components/Delete/index.js

import { useDispatch } from "react-redux";

const Delete = ({params: {itemName}, setIsOpen}) => {

    const handleYes = (e) => {
        e.preventDefault();
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
