import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json
                })
            });
    }

    handleButtonClick = () => {
        console.log('hi')
    }

    render() {

        var {isLoaded, items} = this.state;

        if (!isLoaded) {
            return <div>Loading ...</div>
        } else {
            return (
                <div>
                    <ul>
                        {items.map(item => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
                    <button className="btn btn-light btn-sm" onClick={this.handleButtonClick}> hi </button>
                </div>
            );
        }
    }
}