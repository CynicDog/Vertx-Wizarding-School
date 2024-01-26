import React, { useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';

// TODO: rename presence to event (such as PresenceToast to EventToast ...)
const PresenceToast = ({ presence, onUpdatePresence, messages }) => {
    const toastRef = useRef(null);

    useEffect(() => {
        const messagingToast = new Toast(toastRef.current);

        if (!messagingToast.isShown()) {
            messagingToast.show();
        }
    }, [messages]);


    const getStatusStyle = (statusType) => {

        if (presence === statusType && statusType === 'busy') {
            return 'text-danger-emphasis bg-danger-subtle'
        } else if (presence === statusType && statusType === 'available') {
            return 'text-primary-emphasis bg-primary-subtle'
        } else if (presence === statusType && statusType === 'away') {
            return 'text-success-emphasis bg-success-subtle'
        } else if (presence === statusType && statusType === 'on-call') {
            return 'text-warning-emphasis bg-warning-subtle'
        } else if (presence === statusType && statusType === 'offline') {
            return 'text-dark-emphasis bg-dark-subtle'
        } else {
            return 'text-bg-light fw-light'
        }
    };

    return (
        <div className="toast align-items-center border-1" style={{ width: '300px' }} role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
            <div className="">
                <div className="toast-body">
                    <div className="my-1 pb-2">
                        <span className="fw-light fs-5">Currently I am ... </span> <br />
                    </div>
                    <div className="mx-1">
                        <span
                            className={`btn badge rounded-pill border-primary ${getStatusStyle('available')}`}
                            onClick={() => onUpdatePresence('available')}>
                            Available
                        </span>
                        <span
                            className={`btn badge rounded-pill border-success ${getStatusStyle('away')} mx-1`}
                            onClick={() => onUpdatePresence('away')}>
                            Away
                        </span>
                        <span
                            className={`btn badge rounded-pill border-warning ${getStatusStyle('on-call')}`}
                            onClick={() => onUpdatePresence('on-call')}>
                            On Call
                        </span>
                        <span
                            className={`btn badge rounded-pill border-danger ${getStatusStyle('busy')} mx-1`}
                            onClick={() => onUpdatePresence('busy')}>
                            Busy
                        </span>
                        <span
                            className={`btn badge rounded-pill border-dark ${getStatusStyle('offline')}`}
                            onClick={() => onUpdatePresence('offline')}>
                            Offline
                        </span>
                    </div>
                    {(messages.length > 0) &&
                        <div className="mt-3 py-2">
                            <span className="fw-light fs-5">
                                Notifications
                            </span><br/>
                            {/* iterate for message in messages */}
                            {messages.map((message, index) => (
                                <div key={index}
                                     className="border rounded d-flex justify-content-between align-items-start p-2 my-2">
                                    <div className="ms-2 me-auto overflow-x-auto">
                                        <div className="fw-bold">{message.publisher}</div>
                                        {message.newPresence}
                                    </div>
                                    <span className="badge bg-success-subtle rounded-pill">{message.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default PresenceToast;
