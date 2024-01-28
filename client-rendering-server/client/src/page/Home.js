import React, { Component } from 'react';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            greetingMessage: '',
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch('/greeting')
            .then(res => res.text())
            .then(text => {
                this.setState({
                    isLoaded: true,
                    greetingMessage: text
                })
            });
    }

    render() {
        const {greetingMessage} = this.state;

        return (
            <div>
                {greetingMessage}
            </div>
        );
    }
}
