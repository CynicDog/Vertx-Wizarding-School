import React, { Component } from 'react';
import Image from 'image-js';
import { Popover } from 'bootstrap';
import './MyPage.css'; // Import your custom CSS file

class MyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            userImageSrc: '',
        };
    }

    componentDidMount() {
        const username = new URLSearchParams(window.location.search).get('username');
        this.setState({ username });

        // Fetch user profile photo from server based on the username
        fetch(`http://localhost:4000/api/v1/user/profile`, {
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
                this.setState({ userImageSrc: data.profilePhoto });
            })
            .catch((error) => {
                console.error('Error fetching user photo', error);
            });

        this.initPopover();
    }

    initPopover() {
        // Add a general click event listener to the body for event delegation
        document.body.addEventListener('click', (event) => {
            const cameraIcon = document.getElementById('camera-icon');

            // Check if the clicked element is the camera icon
            if (event.target === cameraIcon) {
                this.handleImageClick();
            }
        });

        const popoverContent = `
            <a class="link-secondary icon-link icon-link-hover mx-1">
                <p class="bi bi-camera-fill" id="camera-icon"></p>
            </a> /
            <a class="link-secondary icon-link icon-link-hover mx-1">
                <p class="bi bi-chat-dots-fill" id="status-icon"></p>
            </a>
        `;

        const imagePopover = new Popover(this.userImage, {
            content: popoverContent,
            placement: 'right',
            trigger: 'click',
            html: true,
            customClass: 'user-profile-photo-popover',
        });
    }


    handleImageClick = () => {
        this.fileInput.click();
    };

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

                // Send the resized file to the server using fetch
                fetch(`http://localhost:4000/api/v1/user/photo`, {
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
                        return response.text(); // You can parse the response if it's JSON
                    })
                    .then((message) => {
                        console.log(message);
                    })
                    .catch((error) => {
                        console.error('Error uploading photo', error);
                    });
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    render() {
        const { username, userImageSrc } = this.state;
        return (
            <div>
                <div className="user-profile-photo-wrapper">
                    <img
                        type="button"
                        className="rounded-circle shadow-sm object-fit-cover position-relative mx-1"
                        style={{ width: '35px', height: '35px' }}
                        src={userImageSrc}
                        alt={`${username}'s profile`}
                        ref={(img) => (this.userImage = img)}
                        data-bs-toggle="popover"
                    />
                    <div className="user-status not-available"></div>
                </div>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={this.handleFileSelect}
                    ref={(input) => (this.fileInput = input)}
                />
                <div>This is {username}'s personal page</div>
            </div>
        );
    }
}

export default MyPage;