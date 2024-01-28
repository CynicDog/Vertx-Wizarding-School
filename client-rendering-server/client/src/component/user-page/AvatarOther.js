import React, { useState, useEffect } from 'react';
import { Popover } from 'bootstrap';

const AvatarOther = ({ username }) => {
    const [userImageSrc, setUserImageSrc] = useState('');
    const [presence, setPresence] = useState('');

    useEffect(() => {

        fetch(`http://localhost:4000/api/v1/user/profile?username=${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user photo');
                }
                return response.json();
            })
            .then((data) => {
                setUserImageSrc(data.profilePhoto);
                setPresence(data.presence);

                // Initialize popover here
                initPopover();
            })
            .catch((error) => {
                console.error('Error fetching user photo', error);
            });
    }, [username]);

    const initPopover = () => {
        const popoverContent = `
            <a class="link-secondary icon-link icon-link-hover mx-1">
                <p class="bi bi-chat-dots-fill" id="chat-icon" data-username="${username}"></p>
            </a> / 
            <a class="link-secondary icon-link icon-link-hover mx-1">
                <p class="bi bi bi-person-add" id="follow-icon" data-username="${username}"></p>
            </a>
        `;

        const imagePopover = new Popover(document.getElementById('img-' + username), {
            content: popoverContent,
            placement: 'bottom',
            trigger: 'click',
            html: true,
            customClass: 'user-profile-photo-popover'
        });
    };

    return (
        <div className="user-profile-photo-wrapper">
            <img
                id={`img-${username}`}
                type="button"
                className="rounded-circle object-fit-cover position-relative mx-1"
                style={{ width: '35px', height: '35px' }}
                src={userImageSrc}
                data-bs-toggle="popover"
            />
            <div type="button" className={`user-presence ${presence}`}></div>
        </div>
    );
};

export default AvatarOther;
