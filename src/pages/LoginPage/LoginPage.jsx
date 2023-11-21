import CredentialsForm from "../../components/CredentialsForm/CredentialsForm";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function LoginPage() {
    // Check if the user is logged in

    useEffect(() => {

    }, [])

    return (
        <div>
            <CredentialsForm
                version = "login"
                initialData = {null}
            />
        </div>
    );
}

export default LoginPage;