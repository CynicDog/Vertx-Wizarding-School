import React, { Component } from 'react';

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
    }

    handleImageClick = () => {
        this.fileInput.click();
    };

    handleFileSelect = (event) => {
        const fileInput = event.target;
        const userImage = this.userImage;

        // TODO: resize user-post images into smaller fit
        // Check if a file is selected
        if (fileInput.files && fileInput.files[0]) {
            const selectedFile = fileInput.files[0];

            // Create a FileReader to read the selected file
            const reader = new FileReader();

            reader.onload = function (e) {
                // Set the image source to the selected file
                this.setState({ userImageSrc: e.target.result });

                const base64Data = e.target.result.split(',')[1];
                const jwt = sessionStorage.getItem('jwt');

                // Send the file to the server using fetch
                fetch(`http://localhost:4000/api/v1/user/photo`, {
                    method: 'POST',
                    body: JSON.stringify({'base64Data': base64Data}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`
                    },
                })
                    .then(response => {
                        // Handle the response from the server
                        if (!response.ok) {
                            throw new Error('Failed to upload photo');
                        }
                        return response.json(); // You can parse the response if it's JSON
                    })
                    .then(data => {
                        // Handle the data returned by the server, if needed
                        console.log('Photo uploaded successfully', data);
                    })
                    .catch(error => {
                        // Handle errors during the fetch
                        console.error('Error uploading photo', error);
                    });
            }.bind(this);

            reader.readAsDataURL(selectedFile);
        }
    };

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
