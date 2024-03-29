import './Avatar.css';
import React, { Component } from 'react';
import eventbus, {registerHandler} from "../../module/eventbus";
import Image from 'image-js';
import { Popover } from 'bootstrap';
import PresenceToast from "../toast/PresenceToast";

class AvatarMe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            userImageSrc: '',
            showPresenceToast: false,
            toastPosition: { top: 0,  left: 0 },
            presence: '',
            messages: []
        };
    }

    componentDidMount() {
        const username = sessionStorage.getItem('username');
        this.setState({ username });

        // TODO: Error handling
        fetch(`http://localhost:4000/api/v1/me/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
            },
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

        registerHandler("EB.updates.user.register", (err, message) => {
            const newMessage = message.body;

            // TODO: persist messages over routing
            this.setState((prevState) => ({
                messages: [...prevState.messages, newMessage],
            }));
        });

        this.initPopover();

        document.body.addEventListener('click', (event) => {
            const cameraIcon = document.getElementById('camera-icon');
            const presenceIcon = document.getElementById('presence-icon');

            if (event.target === cameraIcon) {
                this.handleImageIconClick();
            }
            if (event.target === presenceIcon) {
                this.handlePresenceIconClick(presenceIcon);
            }
        });
    }

    initPopover() {
        const popoverContent = `
            <a class="link-secondary icon-link icon-link-hover mx-1">
                <p class="bi bi-bell-fill" id="presence-icon"></p>
            </a> / 
            <a class="link-secondary icon-link icon-link-hover mx-1">
                <p class="bi bi-camera-fill" id="camera-icon"></p>
            </a>
        `;

        const imagePopover = new Popover(this.userImage, {
            content: popoverContent,
            placement: 'bottom',
            trigger: 'click',
            html: true,
            customClass: 'user-profile-photo-popover',
        });
    }

    handleImageIconClick = () => {
        this.fileInput.click();
    };

    handlePresenceIconClick = (presenceIcon) => {
        if (presenceIcon) {
            const rect = presenceIcon.getBoundingClientRect();

            this.setState((prevState) => ({
                showPresenceToast: !prevState.showPresenceToast,
                toastPosition: { top: rect.top - 9, left: rect.left - 340 }
            }));
        }

        if (this.state.showPresenceToast) {
            this.setState({messages: []})
        }
    }

    handleFileSelect = async (event) => {
        const fileInput = event.target;

        // Check if a file is selected
        if (fileInput.files && fileInput.files[0]) {
            const selectedFile = fileInput.files[0];

            // Create a FileReader to read the selected file
            const reader = new FileReader();

            reader.onload = async (e) => {
                // Resize the image using image-js
                const image = await Image.load(e.target.result);
                const resizedImage = image.resize({
                    preserveAspectRatio: true,
                    width: 100,
                }); // Adjust the dimensions as needed

                // Convert the resized image back to base64
                const base64Data = resizedImage.toDataURL();

                // TODO: Error handling
                // Send the resized file to the server using fetch
                fetch(`http://localhost:4000/api/v1/me/photo`, {
                    method: 'POST',
                    body: JSON.stringify({ base64Data }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
                    },
                })
                    .then((response) => {
                        // Handle the response from the server
                        if (!response.ok) {
                            throw new Error('Failed to upload photo');
                        }
                        // Let uploaded image appear on page
                        this.setState({ userImageSrc: base64Data });
                        return response.text();
                    })
                    .then((message) => {
                        console.log(message);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    handlePresenceChange = (newPresence) => {

        if (newPresence !== this.state.presence) {
            this.setState({ presence: newPresence });
            const {username} = this.state;

            // TODO: Error handling
            fetch(`http://localhost:4000/api/v1/me/presence`, {
                method : 'POST',
                body: JSON.stringify({ username, newPresence }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`
                }
            })
                .then((response) => {
                    // Handle the response from the server
                    if (!response.ok) {
                        throw new Error('Failed to update presence.');
                    }
                    return response.text();
                })
                .then((message) => {
                    // console.log("a." + message);
                })
                .catch((error) => {
                    // console.error("b." + error);
                });
        }
    };

    render() {
        const { username, userImageSrc, showPresenceToast, toastPosition, presence, messages } = this.state;
        return (
            <div>
                <div className="user-profile-photo-wrapper">
                    <img
                        type="button"
                        className="rounded-circle object-fit-cover position-relative mx-1"
                        style={{ width: '35px', height: '35px' }}
                        src={userImageSrc}
                        ref={(img) => (this.userImage = img)}
                        data-bs-toggle="popover"
                    />
                    <div type="button" className={`user-presence ${presence}`}></div>
                    {(messages.length > 0) && <div type="button" className="user-notification" id="notification-mark">
                        {messages.length > 9 ? '9+' : messages.length}
                    </div>}
                </div>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={this.handleFileSelect}
                    ref={(input) => (this.fileInput = input)}
                />
                <div
                    className="toast-container"
                    style={{ top: `${toastPosition.top}px`, left: `${toastPosition.left}px` }}>
                    {showPresenceToast && <PresenceToast presence={presence} onUpdatePresence={this.handlePresenceChange} messages={messages}/>}
                </div>
            </div>
        );
    }
}

export default AvatarMe;
