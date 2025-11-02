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

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [btnSubmit, setBtnSubmit] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // === Fetch ALL pending messages from API ===
    useEffect(() => {
        const fetchAllPendingMessages = async () => {
            try {
                // Redirect to login if not authenticated
                if (!isAuthenticated) {
                    await loginWithRedirect();
                    return;
                }

                const token = await getAccessTokenSilently();
                // Gọi API để lấy TẤT CẢ messages chưa được trả lời
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;

                console.log("=== DEBUG ADMIN MESSAGES ===");
                console.log("Fetching URL:", url);
                console.log("===========================");

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
                console.log("Admin messages data:", data);

                // Debug messages
                if (data._embedded && data._embedded.messages) {
                    console.log("=== DEBUG MESSAGES ===");
                    data._embedded.messages.forEach((msg: any, index: number) => {
                        console.log(`Message ${index}:`, msg);
                    });
                    console.log("====================");

                    setMessages(data._embedded.messages);
                    setTotalPages(data.page.totalPages);
                } else {
                    setMessages([]);
                    setTotalPages(0);
                }
            } catch (error: any) {
                console.error("Error fetching admin messages:", error);
                setHttpError(error.message);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchAllPendingMessages();
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
            console.log("=== DEBUG ADMIN RESPONSE ===");
            console.log("Message ID:", id);
            console.log("Response:", response);
            console.log("===========================");

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
                    const errorText = await responseApi.text();
                    console.error("API Error:", responseApi.status, errorText);
                    throw new Error(`Failed to submit admin response: ${responseApi.status}`);
                }

                // Hiển thị thông báo thành công
                setSubmitSuccess(true);
                setSubmitError(null);

                // Toggle to re-fetch updated messages
                setBtnSubmit(!btnSubmit);

                // Ẩn thông báo sau 3 giây
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 3000);
            }
        } catch (error: any) {
            console.error("Error submitting admin response:", error);
            setSubmitError(error.message);
            setSubmitSuccess(false);

            // Ẩn thông báo lỗi sau 5 giây
            setTimeout(() => {
                setSubmitError(null);
            }, 5000);
        }
    }

    // === Pagination handler ===
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // === Render UI - Hiển thị TẤT CẢ Q&A chưa được trả lời ===
    return (
        <div className="mt-3">
            {/* Thêm thông báo feedback */}
            {submitSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> Response submitted successfully.
                    <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
                </div>
            )}

            {submitError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> {submitError}
                    <button type="button" className="btn-close" onClick={() => setSubmitError(null)}></button>
                </div>
            )}

            {messages.length > 0 ? (
                <>
                    <h5>All Pending Q/A Messages ({messages.length}):</h5>
                    {messages.map((message) => (
                        <AdminMessage
                            message={message}
                            key={message.id}
                            submitResponseToQuestion={submitResponseToQuestion}
                        />
                    ))}
                </>
            ) : (
                <h5>No pending Q/A messages</h5>
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