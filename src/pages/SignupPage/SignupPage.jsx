import CredentialsForm from "../../components/CredentialsForm/CredentialsForm";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const myAPI = process.env.REACT_APP_EXPRESS_SERVER_URL;

function SignupPage() {
    const [ userAuth, setUserAuth ] = useState("Checking...");
    const navigator = useNavigate();

    // Check if the user is logged in
    useEffect(() => {
        const token = sessionStorage.getItem("token");

        async function checkAuth() {
            try {
                const authResponse = await axios.get(`${myAPI}/users/my-info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                navigator("/");
            } catch (error) {
                setUserAuth(error);
            }
        }
    
        if (!token) {
            // User isn't logged in
        } else {
            checkAuth();
        }
      }, []);

    // Checking authentication
    if (userAuth === "Checking...") {
        return <p>Loading...</p>;
    }

    return (
        <main className="signup-page">
            <CredentialsForm
                version = "signup"
            />
        </main>
    );
}

export default SignupPage;