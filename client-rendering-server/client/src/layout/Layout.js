import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Navbar from '../component/nav/Navbar'
export class Layout extends Component {

    render () {
        return (
            <div>
                <Navbar />
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
