import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setErrors({ confirmPassword: "Passwords must match" });
        }
        setErrors({});
        return dispatch(
            sessionActions.signup({
                email,
                username,
                firstName,
                lastName,
                password,
            })
        )
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>Email<input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label>Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
                <label>First Name<input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></label>
                <label>Last Name<input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></label>
                <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                <label>Confirm Password<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></label>
                {errors.email && <p>{errors.email}</p>}
                {errors.username && <p>{errors.username}</p>}
                {errors.firstName && <p>{errors.firstName}</p>}
                {errors.lastName && <p>{errors.lastName}</p>}
                {errors.password && <p>{errors.password}</p>}
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </>
    );
}

export default SignupFormModal;
