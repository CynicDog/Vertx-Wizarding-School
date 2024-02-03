import { Component } from "react";

export class SingupEntry extends Component {

    render() {
        return (
            <div className="row text-center my-4">
                <div className="row my-5">
                    <div className="col my-4">
                        <div className="fw-lighter fs-2 my-3 "> Welcome to Vertx Wizarding World!</div>
                        <div className="fw-light fs-5 py-3 mb-5">
                            <span className="p-2">
                                Thank you for choosing to join our community. We're excited to have you onboard!
                            </span>
                        </div>
                        <div className="fw-lighter fs-1">You'd love to sign up as.. </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col fw-light my-3"><a className="btn border" href="/signup/student">✏️ Student</a></div>
                </div>
                <div className="row">
                    <div className="col fw-light my-3"><a className="btn border" href="/signup/teacher">🖋️ Teacher</a></div>
                </div>
            </div>
        );
    }
}