import React, { useState, useEffect } from 'react';
import { Popover } from 'bootstrap';

const AvatarOther = ({ username, presenceMessage }) => {
    const [userImageSrc, setUserImageSrc] = useState('');
    const [presence, setPresence] = useState('');

    useEffect(() => {

        // check if there is a presence update message from the Kafka-eventbus topic pipeline
        // and if the message is related to the current user (matching usernames)
        if (presenceMessage && username === presenceMessage.username) {
            setPresence(presenceMessage.newPresence);
        } else {
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
                })
                .catch((error) => {
                    console.error('Error fetching user photo', error);
                });
        }

        initPopover();
    }, [username, presenceMessage]);

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
            trigger: 'hover',
            delay: {"hide": 1500},
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
