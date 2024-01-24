import React, { useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';

const StatusToast = ({ status }) => {
    const toastRef = useRef(null);

    useEffect(() => {
        const messagingToast = new Toast(toastRef.current);
        messagingToast.show();
    }, []);

    const getStatusStyle = (statusType) => {
        return status === statusType ? 'btn-primary' : 'btn-secondary';
    };

    return (
        <div className="toast align-items-center border-1" style={{ height: '150px', width: '200px' }} role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
            <div className="d-flex">
                <div className="toast-body">
                    <div className="my-1 pb-2">
                        <span className="fw-light">Currently I am ... </span> <br />
                    </div>
                    <div>
                        <span className={`btn badge border rounded-pill ${getStatusStyle('Available')}`}>Available</span> {/*add bg-primary-subtle*/}
                        <span className={`btn badge border rounded-pill ${getStatusStyle('Away')}`}>Away</span> {/*add bg-success-subtle*/}
                        <span className={`btn badge border rounded-pill ${getStatusStyle('On-Call')}`}>On Call</span> {/*add bg-warning-subtle*/}
                        <span className={`btn badge border rounded-pill ${getStatusStyle('Busy')}`}>Busy</span> {/*add bg-danger-subtle*/}
                        <span className={`btn badge border rounded-pill ${getStatusStyle('Offline')}`}>Offline</span> {/*add bg_light-subtle*/}
                    </div>
                </div>
                {/*add close button*/}
            </div>
        </div>
    );
};

export default StatusToast;
