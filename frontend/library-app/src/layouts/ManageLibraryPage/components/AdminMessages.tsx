import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { AdminMessage } from "./AdminMessage";

export const AdminMessages = () => {
    const {
        isAuthenticated,
        getAccessTokenSilently,
        loginWithRedirect,
        isLoading: authLoading,
    } = useAuth0();

    // Loading states
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Message data
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Re-fetch trigger after admin response
    const [btnSubmit, setBtnSubmit] = useState(false);

    // === Fetch messages from API ===
    useEffect(() => {
        const fetchUserMessages = async () => {
            try {
                // Redirect to login if not authenticated
                if (!isAuthenticated) {
                    await loginWithRedirect();
                    return;
                }

                const token = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage - 1
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
                setHttpError(error.message);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchUserMessages();
        window.scrollTo(0, 0);
    }, [isAuthenticated, getAccessTokenSilently, currentPage, btnSubmit]);

    // === Loading and error UI ===
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

    // === Handle admin response to question ===
    async function submitResponseToQuestion(id: number, response: string) {
        try {
            if (!isAuthenticated) {
                await loginWithRedirect();
                return;
            }

            const token = await getAccessTokenSilently();
            const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;

            if (id && response.trim() !== "") {
                const messageAdminRequestModel = new AdminMessageRequest(id, response);
                const requestOptions = {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(messageAdminRequestModel),
                };

                const responseApi = await fetch(url, requestOptions);
                if (!responseApi.ok) {
                    throw new Error("Failed to submit admin response!");
                }

                // Toggle to re-fetch updated messages
                setBtnSubmit(!btnSubmit);
            }
        } catch (error: any) {
            console.error(error);
            setHttpError(error.message);
        }
    }

    // === Pagination handler ===
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // === Render UI ===
    return (
        <div className="mt-3">
            {messages.length > 0 ? (
                <>
                    <h5>Pending Q/A:</h5>
                    {messages.map((message) => (
                        <AdminMessage
                            message={message}
                            key={message.id}
                            submitResponseToQuestion={submitResponseToQuestion}
                        />
                    ))}
                </>
            ) : (
                <h5>No pending Q/A</h5>
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
