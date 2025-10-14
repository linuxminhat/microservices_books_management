import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {
    const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();

    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        try {
            // Ensure login
            if (!isAuthenticated) {
                await loginWithRedirect();
                return;
            }

            // Validate inputs
            if (title.trim() === "" || question.trim() === "") {
                setDisplayWarning(true);
                setDisplaySuccess(false);
                return;
            }

            const token = await getAccessTokenSilently();
            const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;

            const messageRequestModel: MessageModel = new MessageModel(title, question);

            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageRequestModel),
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            // Reset form
            setTitle("");
            setQuestion("");
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } catch (error: any) {
            console.error(error);
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="card mt-3">
            <div className="card-header">Ask a question to Luv 2 Read Admin</div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning && (
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
                        </div>
                    )}
                    {displaySuccess && (
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Question</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            onChange={(e) => setQuestion(e.target.value)}
                            value={question}
                        ></textarea>
                    </div>

                    <div>
                        <button
                            type="button"
                            className="btn btn-primary mt-3"
                            onClick={submitNewQuestion}
                        >
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
