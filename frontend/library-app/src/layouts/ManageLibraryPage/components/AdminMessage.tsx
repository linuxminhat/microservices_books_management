import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const AdminMessage: React.FC<{
    message: MessageModel,
    submitResponseToQuestion: any
}> = (props, key) => {

    const [displayWarning, setDisplayWarning] = useState(false);
    const [response, setResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const getMessageId = () => {
        if (props.message.id) return props.message.id;
        if (props.message._links?.self?.href) {
            const href = props.message._links.self.href;
            const id = href.split('/').pop();
            return id ? parseInt(id) : null;
        }
        return null;
    };

    const messageId = getMessageId();

    async function submitBtn() {
        if (messageId && response.trim() !== '') {
            setIsSubmitting(true);
            try {
                await props.submitResponseToQuestion(messageId, response);
                setResponse('');
                setDisplayWarning(false);
            } catch (error) {
                console.error('Error submitting response:', error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setDisplayWarning(true);
        }
    }

    return (
        <div key={messageId}>
            <div className='card mt-2 shadow p-3 bg-body rounded'>
                <h5>Case #{messageId}: {props.message.title}</h5>
                <h6>{props.message.userEmail}</h6>
                <p>{props.message.question}</p>
                <hr />
                <div>
                    <h5>Response: </h5>
                    <form action="PUT">
                        {displayWarning &&
                            <div className='alert alert-danger' role='alert'>
                                All fields must be filled out. Message ID: {messageId}
                            </div>
                        }
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'> Description </label>
                            <textarea
                                className='form-control'
                                id='exampleFormControlTextarea1'
                                rows={3}
                                onChange={e => setResponse(e.target.value)}
                                value={response}
                                disabled={isSubmitting}
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type='button'
                                className='btn btn-primary mt-3'
                                onClick={submitBtn}
                                disabled={isSubmitting || !messageId}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Response'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}