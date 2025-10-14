import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";

export const Messages = () => {
    const {
        isAuthenticated,
        getAccessTokenSilently,
        user,
        loginWithRedirect,
        isLoading: authLoading,
    } = useAuth0();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            try {
                // Redirect to login if user not authenticated
                if (!isAuthenticated) {
                    await loginWithRedirect();
                    return;
                }

                const token = await getAccessTokenSilently();

                // Use Auth0 user email (or sub if you prefer unique id)
                const userEmail = user?.email || user?.sub;

                const url = `${process.env.REACT_APP_API}/messages/search/findByUserEmail/?userEmail=${userEmail}&page=${currentPage - 1
                    }&size=${messagesPerPage}`;

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Something went wrong while fetching messages!");
                }

                const data = await response.json();
                setMessages(data._embedded.messages);
                setTotalPages(data.page.totalPages);
            } catch (error: any) {
                console.error(error);
                setHttpError(error.message);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchUserMessages();
        window.scrollTo(0, 0);
    }, [isAuthenticated, getAccessTokenSilently, currentPage, loginWithRedirect, user]);

    // 🌀 Loading and error states
    if (isLoadingMessages || authLoading) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // ✅ UI
    return (
        <div className="mt-2">
            {messages.length > 0 ? (
                <>
                    <h5>Current Q/A:</h5>
                    {messages.map((message) => (
                        <div key={message.id}>
                            <div className="card mt-2 shadow p-3 bg-body rounded">
                                <h5>
                                    Case #{message.id}: {message.title}
                                </h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr />
                                <div>
                                    <h5>Response:</h5>
                                    {message.response && message.adminEmail ? (
                                        <>
                                            <h6>{message.adminEmail} (admin)</h6>
                                            <p>{message.response}</p>
                                        </>
                                    ) : (
                                        <p>
                                            <i>
                                                Pending response from administration. Please be patient.
                                            </i>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <h5>All questions you submit will be shown here</h5>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
};
