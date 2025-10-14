import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";

const CallbackPage = () => {
    const { isAuthenticated, isLoading, error } = useAuth0();
    const history = useHistory();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                history.replace("/home");
            } else if (error) {
                console.error("Auth error:", error);
                history.replace("/home");
            }
        }
    }, [isAuthenticated, isLoading, error, history]);

    return <SpinnerLoading />;
};

export default CallbackPage;