import axios from "axios";
import { useState } from "react";

const myAPI = process.env.REACT_APP_EXPRESS_SERVER_URL;

function PickUsername({ changeState, changeName }) {
    const [ username, setUsername ] = useState("");
    const [ usernameError, setUsernameError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    async function updateErrorMessage(errorText) {
        setErrorMessage(errorText);
        setTimeout(() => {
            setErrorMessage("");
        }, 3000)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        // Handle form errors first
        if (!username) {
            updateErrorMessage("Please enter a username");
            setUsernameError(true);
            return;
        }

        // Check the server to see if the name is taken
        try {
            const isTaken = await axios.get(`${myAPI}/users/is-name-taken?username=${username}`);
            if (isTaken.data) {
                updateErrorMessage("That username is taken");
                return;
            } else {
                // Username is valid, return to parent
                changeName(username, false);
                return;
            }
        } catch (error) {
            const serverErrorResponse = error?.response?.data;
            if (serverErrorResponse) {
                updateErrorMessage(serverErrorResponse);
            }
        }
    }

    return (
        <div className="pick-username">
            <div className="pick-username__overlay"></div>
            <div className="pick-username__container">
                <form action="submit" onSubmit={handleSubmit} className="pick-username__form">
                    <p className={`pick-username__error-text ${
                        errorMessage === "" ? "hidden" : ""
                    }`}>
                        {errorMessage}
                    </p>
                    <div className="pick-username__input-wrapper">
                        <label htmlFor="username" className="pick-username__label">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            className={`pick-username__input-text ${
                                usernameError ? "pick-username__input-text--invalid" : ""
                            }`}
                            placeholder="Pick a username!"
                            onChange={(event) => {
                                setUsername(event.target.value);
                                setUsernameError(false);
                            }}
                            value={username}
                        />
                    </div>
                    <button className="pick-username__button" type="submit">Choose Name</button>
                </form>
            </div>
        </div>
    );
}

export default PickUsername;