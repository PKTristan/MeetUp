
import Modal from "react-modal";
import { useState } from "react";

const InterimModal = ({ Component, bName, args }) => {

    const [isOpen, setIsOpen] = useState(false);


    return (
        <>
            <button onClick={() => setIsOpen(true)}>{bName}</button>

            <Modal isOpen={isOpen}>
                <button onClick={() => setIsOpen(false)}>X</button>
                <Component args={args} />
            </Modal>
        </>
    );
};

export default InterimModal;
