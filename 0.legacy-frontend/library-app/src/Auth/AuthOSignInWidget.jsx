import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const Auth0SignInWidget = () => {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect();
        }
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    return (
        <div className="container mt-5 mb-5 text-center">
            <h3>Redirecting to sign in...</h3>
        </div>
    );
};

export default Auth0SignInWidget;
