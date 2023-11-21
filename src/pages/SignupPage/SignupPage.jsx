import CredentialsForm from "../../components/CredentialsForm/CredentialsForm";

function SignupPage() {
    // Check if the user is logged in

    return (
        <div>
            <CredentialsForm
                version = "signup"
                initialData = {null}
            />
        </div>
    );
}

export default SignupPage;