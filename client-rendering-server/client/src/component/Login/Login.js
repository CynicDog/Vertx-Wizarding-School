import React, {Component} from "react";
import { Toast } from "bootstrap";

export class Login extends Component {

    max_retries = 2;
    retry_interval = 2000; // 2 seconds

    constructor(props) {
        super(props);

        this.state = {
            username: "", password: "", validationStatus: {
                username: null, password: null
            }, usernameMessage: "", passwordMessage: "", loginProcessing: false
        };
    }

    handleUsernameBlur = () => {

        // bind value
        const {username} = this.state;

        // reset validation status
        this.setState((prevState) => ({
            validationStatus: {...prevState.validationStatus, username: null}
        }));

        if (username.trim() === '') {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: false}, usernameMessage: "Required."
            }))
        } else {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, username: true}, usernameMessage: ""
            }))
        }
    }

    handlePasswordBlur = () => {

        // bind value
        const {password} = this.state;

        // reset validation status
        this.setState((prevState) => ({
            validationStatus: {...prevState.validationStatus, password: null}
        }));

        if (password.trim() === '') {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, password: false}, passwordMessage: "Required."
            }))
        } else {
            this.setState((prevState) => ({
                validationStatus: {...prevState.validationStatus, password: true}, passwordMessage: ""
            }))
        }
    }

    handleInputChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    };

    showMessagingToast = (message) => {
        const messagingToast = new Toast(document.getElementById('messagingToast'));

        const toastBody = messagingToast._element.querySelector('.toast-body');
        toastBody.textContent = message;

        messagingToast.show();
    }

    handleLoginClick = () => {

        const {username, password} = this.state;

        this.setState({loginProcessing: true});
        function login(retryCount = 0) {
            fetch(`http://localhost:4000/api/v1/user/login`, {
                method: "POST", body: JSON.stringify({
                    "username": username, "password": password
                })
            }).then(response => {
                if (response.ok) {
                    response.text().then(jwt => {
                        sessionStorage.setItem('jwt', jwt)
                        sessionStorage.setItem('username', username)
                        this.setState((prevState) => ({
                            loginProcessing: false, validationStatus: {username: true, password: true}
                        }));
                        window.location.href = "/";
                    })
                } else if (response.status === 401) { // login failed for wrong credentials
                    response.text().then(errorMessage => {
                        this.setState((prevState) => ({
                            username: '',
                            password: '',
                            loginProcessing: false,
                            validationStatus: {username: null, password: null}
                        }));

                        this.showMessagingToast(errorMessage);
                    });
                } else if (response.status === 500) { // when api-server(4000) is up but user-service(3000) is down
                    throw new Error();
                }
            }).catch(error => { // when api-server(4000) is down
                if (retryCount < this.max_retries) {
                    setTimeout(() => {
                        login.call(this, retryCount + 1);
                    }, this.retry_interval);
                } else {
                    this.setState((prevState) => ({
                        username: '',
                        password: '',
                        loginProcessing: false,
                        validationStatus: {username: null, password: null}
                    }));
                    this.showMessagingToast('Login failed. Try again later please.');
                }
            });
        }
        login.call(this);
    }

    render() {
        const {username, password, loginProcessing, validationStatus, usernameMessage, passwordMessage} = this.state;
        return (<div>
            <div className="row my-5 justify-content-center align-items-center">
                <div className="col-6 my-5">
                    <div className="card shadow my-5">
                        <div className="fw-lighter fs-4 p-4">Login</div>
                        <div className="card-body">
                            <div className="form-floating my-4">
                                <input id="username-input" type="text" value={username} name="username"
                                       placeholder=""
                                       className={`form-control  my-1 ${validationStatus.username === false ? "is-invalid" : validationStatus.username === true ? "is-valid" : ""}`}
                                       onBlur={this.handleUsernameBlur}
                                       onChange={this.handleInputChange}/>
                                <label htmlFor="username-input" className="fw-lighter">
                                    username
                                </label>
                                <div id="username-invalid"
                                     className={`${validationStatus.username ? "d-none" : "invalid-feedback"}`}>
                                    {validationStatus.username ? "" : usernameMessage}
                                </div>
                            </div>
                            <div className="form-floating my-4">
                                <input id="password-input" type="password" value={password} name="password"
                                       placeholder=""
                                       className={`form-control ${validationStatus.password === false ? "is-invalid" : validationStatus.password === true ? "is-valid" : ""}`}
                                       onBlur={this.handlePasswordBlur}
                                       onChange={this.handleInputChange}/>
                                <label htmlFor="username-input" className="fw-lighter">
                                    password
                                </label>
                                <div id="password-invalid"
                                     className={`${validationStatus.password ? "d-none" : "invalid-feedback"}`}>
                                    {validationStatus.password ? "" : passwordMessage}
                                </div>
                            </div>
                            <div className="mt-4 d-flex align-items-center">
                                <button
                                    className="btn btn-light btn-sm ms-auto"
                                    disabled={!Object.values(validationStatus).every((status) => status === true) || loginProcessing}
                                    onClick={this.handleLoginClick}>
                                    <span>Login</span>
                                    {loginProcessing && (
                                        <div id="loginProcessingSpinner" className="spinner-border spinner-border-sm text-primary ms-1" role="status"></div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="toast-container position-fixed bottom-0 end-0 p-4">
                    <div id="messagingToast" className="toast align-items-center text-bg-danger border-0"
                         role="alert"
                         aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto"
                                    data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}