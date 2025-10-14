import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";

const LoginWidget = () => {
    const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
    const history = useHistory();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Redirect user to Auth0's hosted login page
            loginWithRedirect();
        }

        if (isAuthenticated) {
            // If logged in, redirect to home
            history.push("/");
        }
    }, [isAuthenticated, isLoading, loginWithRedirect, history]);

    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (error) {
        console.error("Auth0 login error:", error);
        return (
            <div className="container mt-5">
                <h4>Authentication Error</h4>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 text-center">
            <h4>Redirecting to login...</h4>
        </div>
    );
};

export default LoginWidget;
