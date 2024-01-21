import React, { Component } from 'react';

class MyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };
    }

    componentDidMount() {
        const username = new URLSearchParams(window.location.search).get('username');
        this.setState({ username: username });
    }

    handleImageClick = () => {
        document.getElementById('fileInput').click();
    };

    // TODO: replace those direct DOM elements access with state management
    handleFileSelect = (event) => {
        const fileInput = event.target;
        const userImage = document.getElementById('userImage');

        // Check if a file is selected
        if (fileInput.files && fileInput.files[0]) {
            const selectedFile = fileInput.files[0];

            // Create a FileReader to read the selected file
            const reader = new FileReader();

            reader.onload = function (e) {
                // Set the image source to the selected file
                userImage.src = e.target.result;

                // Add logic to send the file to the server here
                // You can use the selectedFile variable to send the file
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    render() {
        const { username } = this.state;
        return (
            <div>
                <img
                    type="button"
                    id="userImage"
                    className="rounded-circle shadow-sm object-fit-cover mx-1"
                    style={{ width: '35px', height: '35px' }}
                    onClick={this.handleImageClick}
                />
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={this.handleFileSelect}
                />
                <div>This is {username}'s personal page</div>
            </div>
        );
    }
}

export default MyPage;
