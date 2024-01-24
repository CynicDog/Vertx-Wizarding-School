import React, { useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';

const MessageToast = ({ message }) => {

    // to store a reference to the div element that represents the toast
    const toastRef = useRef(null);

    // to create mutable object references that persist across renders in a functional component
    useEffect(() => {
        const messagingToast = new Toast(toastRef.current);
        const toastBody = messagingToast._element.querySelector('.toast-body');
        toastBody.textContent = message;
        messagingToast.show();
    },
        // to specify the dependencies that the effect relies on. The effect will re-run if any of these dependencies change.
        [message]
    );

    return (
        <div className="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
            <div className="d-flex">
                <div className="toast-body"></div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    );
};

export default MessageToast;
