import React, { Component } from 'react';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: '',
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch('/greeting')
            .then(res => res.text())
            .then(text => {
                this.setState({
                    isLoaded: true,
                    item: text
                })
            });
    }

    render() {
        let item = this.state.item;

        return (
            <div>
                <span>Welcome to Vertx Wizarding School.</span>
                <ul>
                    <span>{item}</span>
                </ul>
            </div>
        );
    }
}
