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
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            try {
                if (!isAuthenticated) {
                    await loginWithRedirect();
                    return;
                }

                const token = await getAccessTokenSilently();
                let userEmail = user?.email;
                if (!userEmail) {
                    userEmail = user?.['https://example.com/email'];
                }
                if (!userEmail) {
                    userEmail = user?.sub;
                }

                console.log("=== DEBUG USER MESSAGES ===");
                console.log("User object:", user);
                console.log("User email:", userEmail);
                console.log("==========================");

                if (!userEmail) {
                    throw new Error("Cannot get user email from Auth0");
                }
                const url = `${process.env.REACT_APP_API}/messages/search/findByUserEmail?user_email=${encodeURIComponent(userEmail)}&page=${currentPage - 1}&size=${messagesPerPage}`; console.log("Fetching URL:", url);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("API Error:", response.status, errorText);
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log("Messages data:", data);

                // Kiểm tra cấu trúc response
                if (data._embedded && data._embedded.messages) {
                    setMessages(data._embedded.messages);
                    setTotalPages(data.page.totalPages);
                } else {
                    setMessages([]);
                    setTotalPages(0);
                }
            } catch (error: any) {
                console.error("Error fetching user messages:", error);
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
                <p>Error: {httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // ✅ UI - Chỉ hiển thị Q&A của user hiện tại
    return (
        <div className="mt-2">
            {messages.length > 0 ? (
                <>
                    <h5>Your Q/A Messages ({messages.length}):</h5>
                    {messages.map((message) => (
                        <div key={message.id}>
                            <div className="card mt-2 shadow p-3 bg-body rounded">
                                <h5>
                                    Case #{message.id}: {message.title}
                                </h5>
                                <h6>From: {message.userEmail}</h6>
                                <p><strong>Question:</strong> {message.question}</p>
                                <hr />
                                <div>
                                    <h5>Response:</h5>
                                    {message.response && message.adminEmail ? (
                                        <>
                                            <h6>Admin: {message.adminEmail}</h6>
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
                <h5>No questions submitted yet. Submit a question to see it here.</h5>
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