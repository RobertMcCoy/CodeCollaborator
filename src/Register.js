import React, { Component } from 'react';
import './Register.css';
import $ from 'jquery';
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
            }
        }

        this.handleForm = this.handleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        //This should validate that the user has entered all information correctloy before firing the submission
        $.ajax({
            type: 'POST',
            url: '/signup',
            data: { 
                'username': this.state.user.username, 
                'email': this.state.user.email, 
                'password': this.state.user.password, 
                'firstname': this.state.user.firstname, 
                'lastname': this.state.user.lastname 
            },
        });
    }

    handleForm(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        if (field === "email") {
            if (!validator.isEmail(event.target.value)) {
                var currentErrors = this.state.errors;
                currentErrors.emailError = "Email must be a valid address!";
                this.setState({
                    errors: currentErrors
                })
            }
            else {
                var currentErrors = this.state.errors;
                currentErrors.emailError = "";
                this.setState({
                    errors: currentErrors
                })
            }
        }
        if (field === "password" || field === "confirmPassword") {
            if (user.password !== user.confirmPassword) {
                var currentErrors = this.state.errors;
                currentErrors.passwordMismatch = "Passwords must match!";
                this.setState({
                    errors: currentErrors
                })
            }
            else {
                var currentErrors = this.state.errors;
                currentErrors.passwordMismatch = "";
                this.setState({
                    errors: currentErrors
                })
            }
        }
        this.setState({
            user
        });
    }

    render() {
        return (
            <div className="container">
                <form id="signup" name="signup" onSubmit={this.handleSubmit} >
                    <h2>Sign-up for CodeCollaborator</h2>
                    {this.state.errors.unfilledFields && <p>*{this.state.errors.unfilledFields}</p>}
                    <div className="form-group">
                        <label htmlFor="email">Email*:</label>
                        <input type="email" className="form-control" name="email" onChange={this.handleForm} value={this.state.user.email} />
                        {this.state.errors.emailError && <p>*{this.state.errors.emailError}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstname">First Name*:</label>
                        <input type="text" className="form-control" name="firstname" onChange={this.handleForm} value={this.state.user.firstname} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name*:</label>
                        <input type="text" className="form-control" name="lastname" onChange={this.handleForm} value={this.state.user.lastname} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username*:</label>
                        <input type="text" className="form-control" name="username" onChange={this.handleForm} value={this.state.user.username} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password*:</label>
                        <input type="password" className="form-control" name="password" onChange={this.handleForm} value={this.state.user.password} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password*:</label>
                        <input type="password" className="form-control" name="confirmPassword" onChange={this.handleForm} value={this.state.user.confirmPassword} />
                        {this.state.errors.passwordMismatch && <p>*{this.state.errors.passwordMismatch}</p>}
                    </div>
                    <input type="submit" value="Register" className="btn btn-info" />
                </form>
            </div>
        );
    }
}

export default Register;
