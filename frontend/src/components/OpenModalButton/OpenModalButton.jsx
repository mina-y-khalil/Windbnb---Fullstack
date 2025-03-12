// frontend/src/components/OpenModalButton/OpenModalButton.jsx
import { useModal } from "../../context/Modal";

function OpenModalButton({ modalComponent, buttonText, onButtonClick }) {
    const { setModalContent } = useModal();

    const onClick = () => {
        if (typeof onButtonClick === "function") onButtonClick();
        setTimeout(() => setModalContent(modalComponent), 0);
    };

    return <button onClick={onClick}>{buttonText}</button>;
}


export default OpenModalButton;
