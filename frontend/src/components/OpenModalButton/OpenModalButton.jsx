// frontend/src/components/OpenModalButton/OpenModalButton.jsx
import { useModal } from "../../context/Modal";

function OpenModalButton({ modalComponent, buttonText, onButtonClick }) {
    const { setModalContent } = useModal();

    const onClick = () => {
        console.log("Modal Button Clicked:", buttonText); // Debugging log
        setModalContent(modalComponent); // Open modal
        if (typeof onButtonClick === "function") onButtonClick(); // Close dropdown if applicable
    };

    return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
