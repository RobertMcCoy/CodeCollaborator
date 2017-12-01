import React, { Component } from 'react';
import './Register.css';
import './main.css';
import { Redirect } from 'react-router';
import axios from 'axios';
import validator from 'validator';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            user: {
                email: '',
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                confirmPassword: ''
            },
            registered: false
        }

        this.verifyInput = this.verifyInput.bind(this);
        this.handleForm = this.handleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        for (var property in this.state.user) {
            this.verifyInput(property, this.state.user[property]);
        }
        for (var error in this.state.errors) {
            if (this.state.errors[error].length > 0) {
                return false;
            }
        }
        axios.post('/auth/signup', {
            'username': this.state.user.username,
            'email': this.state.user.email,
            'password': this.state.user.password,
            'firstname': this.state.user.firstname,
            'lastname': this.state.user.lastname
        }).then((response) => {
            if (response.status === 200) {
                localStorage.setItem('jwtToken', response.data.token);
            }
            this.setState({
                registered: true
            })
        }).catch((response) => {
            localStorage.setItem('jwtToken', '');
            this.setState({
                errors: {
                    registrationError: response.data
                }
            })
        });
    }

    verifyInput(field, value) {
        var currentErrors = this.state.errors;
        if (field === "email") {
            if (!validator.isEmail(value)) {
                currentErrors.emailError = "Email must be a valid address!";
                this.setState({
                    errors: currentErrors
                });
            }
            else {
                currentErrors.emailError = "";
                this.setState({
                    errors: currentErrors
                });
            }
        }
        if (field === "username") {
            if (!value) {
                currentErrors.userNameError = "Username must be present!";
                this.setState({
                    errors: currentErrors
                });
            }
        }
        if (field === "firstname") {
            if (!value) {
                currentErrors.firstNameError = "First Name must be filled in!";
                this.setState({
                    errors: currentErrors
                });
            }
        }
        if (field === "lastname") {
            if (!value) {
                currentErrors.lastNameError = "Last Name must be filled in!";
                this.setState({
                    errors: currentErrors
                });
            }
        }
        if (field === "password") {
            if (!value) {
                currentErrors.passwordError = "Password must be filled in!";
                this.setState({
                    errors: currentErrors
                });
            }
        }
        if (field === "password" || field === "confirmPassword") {
            if (this.state.user.password !== this.state.user.confirmPassword || this.state.user.password === '' || this.state.user.confirmPassword === '') {
                currentErrors.passwordMismatch = "Passwords must match!";
                this.setState({
                    errors: currentErrors
                });
            }
            else {
                currentErrors.passwordMismatch = "";
                this.setState({
                    errors: currentErrors
                });
            }
        }
    }

    handleForm(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        this.verifyInput(field, event.target.value);
        this.setState({
            user
        });
    }

    render() {
        if (this.state.registered) {
            return (
                <Redirect to='/profile' />
            )
        } else {
            return (
                <div className="container">
                    <form id="signup" name="signup" onSubmit={this.handleSubmit} >
                        <h2>Sign-up for CodeCollaborator</h2>
                        {this.state.errors.unfilledFields && <p className="code-collab-error">*{this.state.errors.unfilledFields}</p>}
                        <div className="form-group">
                            <label htmlFor="email">Email*:</label>
                            <input type="email" className="form-control" name="email" onChange={this.handleForm} value={this.state.user.email} />
                            {this.state.errors.emailError && <p className="code-collab-error">*{this.state.errors.emailError}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstname">First Name*:</label>
                            <input type="text" className="form-control" name="firstname" onChange={this.handleForm} value={this.state.user.firstname} />
                            {this.state.errors.firstNameError && <p className="code-collab-error">*{this.state.errors.firstNameError}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Last Name*:</label>
                            <input type="text" className="form-control" name="lastname" onChange={this.handleForm} value={this.state.user.lastname} />
                            {this.state.errors.lastNameError && <p className="code-collab-error">*{this.state.errors.lastNameError}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username*:</label>
                            <input type="text" className="form-control" name="username" onChange={this.handleForm} value={this.state.user.username} />
                            {this.state.errors.userNameError && <p className="code-collab-error">*{this.state.errors.userNameError}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password*:</label>
                            <input type="password" className="form-control" name="password" onChange={this.handleForm} value={this.state.user.password} />
                            {this.state.errors.passwordError && <p className="code-collab-error">*{this.state.errors.passwordError}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password*:</label>
                            <input type="password" className="form-control" name="confirmPassword" onChange={this.handleForm} value={this.state.user.confirmPassword} />
                            {this.state.errors.passwordMismatch && <p className="code-collab-error">*{this.state.errors.passwordMismatch}</p>}
                        </div>
                        {this.state.errors.registrationError && <p className="code-collab-error">*{this.state.errors.registrationError}</p>}
                        <input type="submit" value="Register" className="btn btn-info" />
                    </form>
                </div>
            );
        }
    }
}

export default Register;
