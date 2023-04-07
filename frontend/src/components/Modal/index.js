
import Modal from "react-modal";
import { useState, useEffect } from "react";
import './Modal.css';

const InterimModal = ({ Component, buttonLabel }) => {

    const [isOpen, setIsOpen] = useState(false);



    return (
        <>
            <button onClick={() => setIsOpen(true)}>{buttonLabel}</button>

            <Modal isOpen={isOpen} className="modal">
                <button className="exit-modal" onClick={() => setIsOpen(false)}>X</button>
                <Component />
            </Modal>
        </>
    );
};

export default InterimModal;
