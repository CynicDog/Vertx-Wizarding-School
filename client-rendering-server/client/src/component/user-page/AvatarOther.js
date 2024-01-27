import './Avatar.css';
import React, { Component } from 'react';
import { Popover } from 'bootstrap';

class AvatarOther extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.username,
            userImageSrc: '',
            showPresenceToast: false,
            toastPosition: { top: 0,  left: 0 },
            presence: '',
        };
    }

    componentDidMount() {
        const {username} = this.state;

        // TODO: Error handling
        // Fetch user profile photo from server based on the username
        fetch(`http://localhost:4000/api/v1/user/profile?username=${username}`, {
            method: 'GET'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user photo');
                }
                return response.json();
            })
            .then((data) => {
                // Assuming the server returns the photo as base64 data
                this.setState({ userImageSrc: data.profilePhoto, presence: data.presence });
            })
            .catch((error) => {
                console.error('Error fetching user photo', error);
            });

        this.initPopover();
    }

    initPopover() {
        const {username} = this.state;

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
            placement: 'right',
            trigger: 'click',
            html: true,
            customClass: 'user-profile-photo-popover'
        });
    }

    render() {
        const { username, userImageSrc, showPresenceToast, toastPosition, presence, messages } = this.state;
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
    }
}

export default AvatarOther;
