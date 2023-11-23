import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const myAPI = process.env.REACT_APP_EXPRESS_SERVER_URL;

function CredentialsForm({ version }) {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ usernameError, setUsernameError ] = useState(false);
    const [ passwordError, setPasswordError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const navigator = useNavigate();

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
        } else if (!password) {
            updateErrorMessage("Please enter your password");
            setPasswordError(true);
            return;
        } else if (password.length < 6 && version === "signup") {
            updateErrorMessage("Your password should be at least six characters long");
            setPasswordError(true);
            return;
        }

        // Check the server to see if they can log in
        try {
            const userObj = { username: username, password: password };

            // Create their account first if on the signup page
            if (version === "signup") {
                const isTaken = await axios.get(`${myAPI}/users/is-name-taken?username=${username}`);
                if (isTaken.data) {
                    updateErrorMessage("That username is taken");
                    return;
                } else {
                    await axios.post(`${myAPI}/users/signup`, userObj);
                }
            }

            // Log into their account
            const loginResponse = await axios.post(`${myAPI}/users/login`, userObj);
            localStorage.setItem("token", loginResponse.data.token);
            navigator("/");
        } catch (error) {
            const serverErrorResponse = error?.response?.data;
            if (serverErrorResponse) {
                updateErrorMessage(serverErrorResponse);
            }
        }
    }

    return (
        <form action="submit" className="credentials-form" onSubmit={handleSubmit}>
            <p className={`credentials-form__error-text ${
                errorMessage === "" ? "hidden" : ""
            }`}>
                {errorMessage}
            </p>
            <div className="credentials-form__input-wrapper">
                <label htmlFor="username" className="credentials-form__label">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    className={`credentials-form__input-text ${
                        usernameError ? "credentials-form__input-text--invalid" : ""
                    }`}
                    placeholder="Enter a username"
                    onChange={(event) => {
                        setUsername(event.target.value);
                        setUsernameError(false);
                    }}
                    value={username}
                />
            </div>
            <div className="credentials-form__input-wrapper">
                <label htmlFor="password" className="credentials-form__label">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    className={`credentials-form__input-text ${
                        passwordError ? "credentials-form__input-text--invalid" : ""
                    }`}
                    placeholder="Enter a password"
                    onChange={(event) => {
                        setPassword(event.target.value);
                        if (password.length >= 6) {
                            setPasswordError(false);
                        }
                    }}
                    value={password}
                />
            </div>
            <button className="credentials-form__button" type="submit">{version.toUpperCase()}</button>
        </form>
    );
}

export default CredentialsForm;