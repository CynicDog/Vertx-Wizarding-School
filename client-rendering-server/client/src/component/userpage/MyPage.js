import React, { Component } from 'react';

class MyPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: ''
        }
    }

    componentDidMount() {
        const username = new URLSearchParams(window.location.search).get('username');
        this.setState({username: username})
    }

    render() {
        const {username} = this.state;
        return (
            <div>
                This is {username}'s personal page
            </div>
        );
    }
}

export default MyPage;
