import CredentialsForm from "../../components/CredentialsForm/CredentialsForm";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

function LoginPage() {
    const { userInfo } = useContext(UserContext);
    const navigator = useNavigate();

    // Checking authentication
    useEffect(() => {
        if (userInfo) {
            navigator("/");
        }
      }, [navigator, userInfo]);

    if (userInfo) {
        return;
    }

    return (
        <main className="login-page">
            <CredentialsForm
                version = "login"
            />
        </main>
    );
}

export default LoginPage;