import React, {Component} from "react";

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
                username: null, password: null, email: null,
            },
            usernameMessage: "",
            passwordMessage: "",
            emailMessage: ""
        };
    }

    componentDidMount() {
        // Fetch navigation data here if needed
    }

    handleInputChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    };

    handleUsernameBlur = () => {

        // bind value
        const { username } = this.state;

        // reset validation status
        this.setState((prevState) => ({
            validationStatus: {...prevState.validationStatus, username: false}
        }));

        if (username.trim() === '') {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: false}, usernameMessage: "Required."
            }))
        } else if (username.trim().length > 13) {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: false}, usernameMessage: "Should be under 13 characters."
            }))
        } else if (username.trim().includes(' ')) {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: false}, usernameMessage: "Shouldn't contain blank in username."
            }))
        } else {
            // perform async duplication validation
            const usernameEncoded = encodeURIComponent(username.trim());

            this.setState({ usernameLoading: true } )
            fetch(`http://localhost:4000/api/v1/user/check?username=${usernameEncoded}`, {
                method: "GET",
            }).then((response) => {
                if (response.ok) {
                    this.setState((prevState) => ({
                        usernameLoading: false,
                        validationStatus: {...prevState.validationStatus, username: true}
                    }));
                } else {
                    response.text().then(errorMessage => {
                        this.setState((prevState) => ({
                            usernameLoading: false,
                            validationStatus: {...prevState.validationStatus, username: false},
                            usernameMessage: errorMessage,
                        }));
                    });
                }
            })
        }
    };

    handlePasswordBlur = () => {

        // bind value
        const { password } = this.state;

        // reset validation status
        this.setState((prevState) => ({
            validationStatus: {...prevState.validationStatus, password: false}
        }));

        if (password.trim() === '') {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, password: false}, passwordMessage: "Required."
            }))
        } else if (password.trim().includes(' ')) {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, password: false}, passwordMessage: "Shouldn't contain blank in email."
            }))
        }
        else {
            this.setState((prevState) => ({
                validationStatus: {
                    ...prevState.validationStatus,
                    password: true
                }
            }))
        }
    };

    handleEmailBlur = () => {

        // bind value
        const { email } = this.state;

        // reset validation status
        this.setState((prevState) => ({
            validationStatus: {...prevState.validationStatus, email: false}
        }));

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.trim() === '') {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, email: false}, emailMessage: "Required."
            }))
        } else if (!emailPattern.test(email)) {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, email: false}, emailMessage: "Not a valid form of an email address."
            }))
        } else if (email.trim().includes(' ')) {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, email: false}, emailMessage: "Shouldn't contain blank in email."
            }))
        } else {
            // perform async duplication validation
            this.setState({ emailLoading: true })
            fetch(`http://localhost:4000/api/v1/user/check?email-address=${email}`, {
                method: "GET",
            }).then((response) => {
                if (response.ok) {
                    this.setState((prevState) => ({
                        emailLoading: false, validationStatus: {...prevState.validationStatus, email: true,}
                    }));
                } else {
                    response.text().then(errorMessage => {
                        this.setState((prevState) => ({
                            emailLoading: false,
                            validationStatus: {...prevState.validationStatus, email: false,},
                            emailMessage: errorMessage,
                        }));
                    });
                }
            })
        }
    };

    handleSignupClick = () => {
        // Implement signup logic here
    };

    render() {
        const {
            username,
            password,
            email,
            usernameLoading,
            emailLoading,
            validationStatus,
            usernameMessage,
            passwordMessage,
            emailMessage
        } = this.state;

        return (<div className="row justify-content-center align-items-center my-3">
                <div className="col-md-6">
                    <div className="card shadow my-5 p-5">
                        <div className="fw-lighter fs-2">Student Sign Up</div>
                        <div className="card-body my-3">
                            <div className="form-floating my-3">
                                <input id="username" type="text" name="username" placeholder="" value={username}
                                       className={`form-control ${ validationStatus.username === false ? "is-invalid" : validationStatus.username === true ? "is-valid" : "" }`}
                                       onBlur={this.handleUsernameBlur}
                                       onChange={this.handleInputChange}/>
                                <label className="fw-lighter d-flex" htmlFor="username">
                                    username
                                    <div className="ms-auto">
                                        <div id="usernameLoadingSpinner"
                                             className={`spinner-border spinner-border-sm text-primary m-1 ${usernameLoading ? "" : "d-none"}`}
                                             role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </label>
                                <div id="username-invalid"
                                     className={`${ validationStatus.username? "d-none" : "invalid-feedback" }`}>
                                    {validationStatus.username? "" : usernameMessage}
                                </div>
                            </div>
                            <div className="form-floating my-3">
                                <input id="password" type="password"  name="password" placeholder="" value={password}
                                       className={`form-control ${ validationStatus.password === false? "is-invalid" : validationStatus.password === true? "is-valid" : "" }`}
                                       onBlur={this.handlePasswordBlur}
                                       onChange={this.handleInputChange}
                                />
                                <label className="fw-lighter" htmlFor="password">
                                    password
                                </label>
                                <div id="password-invalid"
                                    className={`${ validationStatus.password? "d-none": "invalid-feedback"}`}>
                                    {validationStatus.password? "" : passwordMessage}
                                </div>
                            </div>
                            <div className="form-floating my-3">
                                <input id="email" type="email" name="email" placeholder="" value={email}
                                       className={`form-control ${ validationStatus.email === false ? "is-invalid" : validationStatus.email === true ? "is-valid" : ""}`}
                                       onBlur={this.handleEmailBlur}
                                       onChange={this.handleInputChange}/>
                                <label className="fw-lighter d-flex" htmlFor="email">
                                    email
                                    <div className="ms-auto">
                                        <div id="emailLoadingSpinner"
                                             className={`spinner-border spinner-border-sm text-primary m-1 ${emailLoading ? "" : "d-none"}`}
                                             role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </label>
                                <div id="email-invalid"
                                    className={`${validationStatus.email ? "d-none" : "invalid-feedback"}`}>
                                    {validationStatus.email? "" : emailMessage}
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button id="signupButton" className="btn btn-light btn-sm"
                                    disabled={!Object.values(validationStatus).every((status) => status === true)}
                                    onClick={this.handleSignupClick}>
                                signup
                            </button>
                        </div>
                    </div>
                </div>
            </div>);
    }
}