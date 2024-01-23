import React, { Component } from 'react';
import Image from "image-js";
import { Popover } from "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import './MyPage.css'; // Import your custom CSS file

class MyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            userImageSrc: ''
        };
    }

    componentDidMount() {
        const username = new URLSearchParams(window.location.search).get('username');
        this.setState({ username });
        this.initPopover();
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
                const resizedImage = image.resize({ preserveAspectRatio: true, width: 100 }); // Adjust the dimensions as needed

                // Convert the resized image back to base64
                const base64Data = resizedImage.toDataURL();

                // Send the resized file to the server using fetch
                fetch(`http://localhost:4000/api/v1/user/photo`, {
                    method: 'POST',
                    body: JSON.stringify({ 'base64Data': base64Data }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
                    },
                })
                    .then(response => {
                        // TODO: implementation on retry
                        // Handle the response from the server
                        if (!response.ok) {
                            throw new Error('Failed to upload photo');
                        }
                        // Let uploaded image appear on page
                        this.setState({ userImageSrc: base64Data });
                        return response.text(); // You can parse the response if it's JSON
                    })
                    .then(message => {
                        console.log(message);
                    })
                    .catch(error => {
                        console.error('Error uploading photo', error);
                    });
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    initPopover() {
        const imagePopover = new Popover(this.userImage, {
            content: "This is a popover!",
            placement: 'right',
            trigger: 'hover',
            customClass: 'user-profile-photo-popover'
        });
    }

    render() {
        const { username, userImageSrc } = this.state;
        return (
            <div>
                <img
                    type="button"
                    className="rounded-circle shadow-sm object-fit-cover mx-1"
                    style={{ width: '35px', height: '35px' }}
                    onClick={this.handleImageClick}
                    src={userImageSrc}
                    alt={`${username}'s profile`}
                    ref={(img) => (this.userImage = img)}
                    data-bs-toggle="popover"
                />
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
