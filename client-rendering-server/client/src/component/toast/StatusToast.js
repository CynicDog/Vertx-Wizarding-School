import React, { useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';

const StatusToast = ({ status, onUpdateStatus }) => {
    const toastRef = useRef(null);

    useEffect(() => {
        const messagingToast = new Toast(toastRef.current);
        messagingToast.show();
    }, []);

    const getStatusStyle = (statusType) => {

        if (status === statusType && statusType === 'busy') {
            return 'text-danger-emphasis bg-danger-subtle'
        } else if (status === statusType && statusType === 'available') {
            return 'text-primary-emphasis bg-primary-subtle'
        } else if (status === statusType && statusType === 'away') {
            return 'text-success-emphasis bg-success-subtle'
        } else if (status === statusType && statusType === 'on-call') {
            return 'text-warning-emphasis bg-warning-subtle'
        } else if (status === statusType && statusType === 'offline') {
            return 'text-dark-emphasis bg-dark-subtle'
        } else {
            return 'text-bg-light fw-light'
        }
    };

    return (
        <div className="toast align-items-center border-1" style={{ height: '120px', width: '200px' }} role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
            <div className="d-flex">
                <div className="toast-body">
                    <div className="my-1 pb-2">
                        <span className="fw-light">Currently I am ... </span> <br />
                    </div>
                    <div>
                        <span
                            className={`btn badge rounded-pill border-primary ${getStatusStyle('available')}`}
                            onClick={() => onUpdateStatus('available')}>
                            Available
                        </span>
                        <span
                            className={`btn badge rounded-pill border-success ${getStatusStyle('away')} mx-1`}
                            onClick={() => onUpdateStatus('away')}>
                            Away
                        </span>
                        <span
                            className={`btn badge rounded-pill border-warning ${getStatusStyle('on-call')}`}
                            onClick={() => onUpdateStatus('on-call')}>
                            On Call
                        </span>
                        <span
                            className={`btn badge rounded-pill border-danger ${getStatusStyle('busy')} me-1`}
                            onClick={() => onUpdateStatus('busy')}>
                            Busy
                        </span>
                        <span
                            className={`btn badge rounded-pill border-dark ${getStatusStyle('offline')}`}
                            onClick={() => onUpdateStatus('offline')}>
                            Offline
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusToast;
