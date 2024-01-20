import React, { Component } from "react";
import { displayErrorMessage, removeErrorMessage, displaySuccessMessage, removeSuccessMessage } from "../../util/ValidationMessage";

export class SignupStudent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            email: "",
            usernameLoading: false,
            emailLoading: false,
            validationStatus: {
                usernameInput: false,
                passwordInput: false,
                emailInput: false,
            },
        };
    }

    componentDidMount() {
        // Fetch navigation data here if needed
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };

    handleUsernameBlur = () => {
        const { username } = this.state;
        const usernameInput = document.getElementById("username");

        // Reset validation status
        this.setState((prevState) => ({
            validationStatus: {
                ...prevState.validationStatus,
                usernameInput: false,
            },
        }));

        if (username.trim() === '') {
            displayErrorMessage(usernameInput, "Required");
        } else if (username.trim().length > 13) {
            displayErrorMessage(usernameInput, "Should be under 13 characters.");
        } else if (username.trim().includes(' ')) {
            displayErrorMessage(usernameInput, "Shouldn't contain blank in username.");
        } else {
            // Perform async duplication validation
            const usernameEncoded = encodeURIComponent(username.trim());

            this.setState({ usernameLoading: true })
            fetch(`http://localhost:4000/api/v1/user/check?username=${usernameEncoded}`, {
                method: "GET",
            }).then((response) => {
                this.setState({
                    usernameLoading: false
                })

                if (response.ok) {
                    // Validation success
                    removeErrorMessage(usernameInput);
                    displaySuccessMessage(usernameInput);

                    this.setState((prevState) => ({
                        validationStatus: {
                            ...prevState.validationStatus,
                            usernameInput: true,
                        },
                    }));
                } else {
                    // Validation error
                    removeSuccessMessage(usernameInput);
                    displayErrorMessage(usernameInput, "Already taken username.");
                }
            });
        }
    };


    handlePasswordBlur = () => {
        // Implement password validation logic here
    };

    handleEmailBlur = () => {
        // Implement email validation logic here
    };

    handleSignupClick = () => {
        // Implement signup logic here
    };

    render() {
        const { username, password, email, usernameLoading, emailLoading, validationStatus } = this.state;

        return (
            <div className="row justify-content-center align-items-center my-3">
                <div className="col-md-6">
                    <div className="card shadow my-5 p-5">
                        <div className="fw-lighter fs-2">Student Sign Up</div>
                        <div className="card-body my-3">
                            <div className="form-floating my-3">
                                <input
                                    type="text"
                                    className='form-control'
                                    name="username"
                                    id="username"
                                    placeholder=""
                                    value={username}
                                    onBlur={this.handleUsernameBlur}
                                    onChange={this.handleInputChange}
                                />
                                <label className="fw-lighter d-flex" htmlFor="username">
                                    username
                                    <div className="ms-auto">
                                        <div
                                            id="usernameLoadingSpinner"
                                            className={`spinner-border spinner-border-sm text-primary m-1 ${usernameLoading ? "" : "d-none"}`}
                                            role="status"
                                        >
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="form-floating my-3">
                                <input
                                    type="password"
                                    className='form-control'
                                    name="password"
                                    id="password"
                                    placeholder=""
                                    value={password}
                                    onBlur={this.handlePasswordBlur}
                                    onChange={this.handleInputChange}
                                />
                                <label className="fw-lighter" htmlFor="password">
                                    password
                                </label>
                            </div>
                            <div className="form-floating my-3">
                                <input
                                    type="email"
                                    className='form-control'
                                    name="email"
                                    id="email"
                                    placeholder=""
                                    value={email}
                                    onBlur={this.handleEmailBlur}
                                    onChange={this.handleInputChange}
                                />
                                <label className="fw-lighter d-flex" htmlFor="email">
                                    email
                                    <div className="ms-auto">
                                        <div
                                            id="emailLoadingSpinner"
                                            className={`spinner-border spinner-border-sm text-primary m-1 ${emailLoading ? "" : "d-none"}`}
                                            role="status"
                                        >
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                id="signupButton"
                                className="btn btn-light btn-sm"
                                disabled={!Object.values(validationStatus).every((status) => status === true)}
                                onClick={this.handleSignupClick}
                            >
                                signup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}