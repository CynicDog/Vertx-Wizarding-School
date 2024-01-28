import React, {Component} from "react";

export class SignupForm extends Component {

    max_retries = 2;
    retry_interval = 2000; // 2 seconds

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
            emailMessage: "",
            type: this.props.type
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
            validationStatus: {...prevState.validationStatus, username: null}
        }));

        if (username.trim() === '') {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: false}, usernameMessage: "Required."
            }))
        } else if (username.trim().length > 17) {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: false}, usernameMessage: "Should be under 17 characters."
            }))
        } else if (username.trim().includes(' ')) {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: false}, usernameMessage: "Shouldn't contain blank in username."
            }))
        } else {
            // perform async duplication validation
            const usernameEncoded = encodeURIComponent(username.trim());

            this.setState({ usernameLoading: true } )

            function validateUsername(username, retryCount = 0) {
                fetch(`http://localhost:4000/api/v1/user/check?username=${usernameEncoded}`, {
                    method: "GET",
                }).then((response) => {
                    if (response.ok) {
                        this.setState((prevState) => ({
                            usernameLoading: false, validationStatus: {...prevState.validationStatus, username: true}
                        }));
                    } else if (response.status === 409) { // a conflict occurs with username already in use
                        response.text().then(errorMessage => {
                            this.setState((prevState) => ({
                                usernameLoading: false,
                                validationStatus: {...prevState.validationStatus, username: false},
                                usernameMessage: errorMessage,
                            }));
                        });
                    } else if (response.status === 500) { // when api-server(4000) is up but user-service(3000) is down
                        throw new Error();
                    }
                }).catch(error => { // when api-server(4000) is down
                    if (retryCount < this.max_retries) {
                        setTimeout(() => {
                            validateUsername.call(this, username, retryCount + 1);
                        }, this.retry_interval);
                    } else {
                        this.setState((prevState) => ({
                            usernameLoading: false,
                            validationStatus: {...prevState.validationStatus, username: false},
                            usernameMessage: 'An error happened with validating your input. Please try again later.',
                        }));
                    }
                });
            }
            // Call the function with the initial parameters
            validateUsername.call(this, username);
        }
    };

    handlePasswordBlur = () => {

        // bind value
        const { password } = this.state;

        // reset validation status
        this.setState((prevState) => ({
            validationStatus: {...prevState.validationStatus, password: null}
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
            validationStatus: {...prevState.validationStatus, email: null}
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

            function validateEmail(email, retryCount = 0) {
                fetch(`http://localhost:4000/api/v1/user/check?email-address=${email}`, {
                    method: "GET",
                }).then((response) => {
                    if (response.ok) {
                        this.setState((prevState) => ({
                            emailLoading: false, validationStatus: {...prevState.validationStatus, email: true,},
                        }));
                    } else if (response.status === 409) { // a conflict occurs with username already in use
                        response.text().then(errorMessage => {
                            this.setState((prevState) => ({
                                emailLoading: false,
                                validationStatus: {...prevState.validationStatus, email: false,},
                                emailMessage: errorMessage,
                            }));
                        });
                    } else if (response.status === 500) { // when api-server(4000) is up but user-service(3000) is down
                        throw new Error();
                    }
                }).catch(error => { // when api-server(4000) is down
                    if (retryCount < this.max_retries) {
                        setTimeout(() => {
                            validateEmail.call(this, email, retryCount + 1);
                        }, this.retry_interval);
                    } else {
                        this.setState((prevState) => ({
                            emailLoading: false,
                            validationStatus: {...prevState.validationStatus, email: false},
                            emailMessage: "An error happened with validating your input. Please try again later."
                        }));
                    }
                });
            }
            validateEmail.call(this, email);
        }
    };

    handleSignupClick = () => {

        const { username, password, email, type } = this.state;

        function register(retryCount = 0) {
            fetch(`http://localhost:4000/api/v1/user/register`, {
                method: "POST",
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                    "emailAddress": email,
                    "type": type
                })
            }).then(response => {
                if (response.ok) {
                    window.location.href = "/";
                }
            }).catch(error => {
                if (retryCount < this.max_retries) {
                    setTimeout(() => {
                        register.call(this, retryCount + 1);
                    }, this.retry_interval);
                } else {
                    this.setState({registerPopupVisible: true});
                }
            })
        }
        register.call(this);
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
            emailMessage,
            type
        } = this.state;

        return (<div className="row justify-content-center align-items-center my-3">
                <div className="col-md-6">
                    <div className="card shadow my-5 p-5">
                        <div className="fw-lighter fs-2">{type} sign up</div>
                        <div className="card-body my-2">
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
                                        </div>
                                    </div>
                                </label>
                                <div id="username-invalid"
                                     className={`${ validationStatus.username? "d-none" : "invalid-feedback" }`}>
                                    {validationStatus.username? "" : usernameMessage}
                                </div>
                            </div>
                            <div className="form-floating my-3">
                                <input id="password" type="password" name="password" placeholder="" value={password}
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