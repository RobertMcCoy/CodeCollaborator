import React, { Component } from 'react';
import './Login.css';
import $ from 'jquery';
import validator from 'validator';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            user: {
                username: '',
                password: ''
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        //This should validate that the user has entered all information correctloy before firing the submission

        if (event.username.value === "" || event.password.value === "") {
            this.setState({
                errors: {
                    badLogin: "Must provide username and password"
                }
            });
        } else {
            $.ajax({
                type: 'POST',
                url: '/auth/login',
                data: {
                    'username': this.state.user.username,
                    'password': this.state.user.password,
                },
            });
        }
    }

    render() {
        return (
            <div className="container">
                <form id="login" name="login" onSubmit={this.handleSubmit} >
                    <h2>Login to CodeCollaborator</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" className="form-control" name="username" onChange={this.handleForm} value={this.state.user.username} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password*:</label>
                        <input type="password" className="form-control" name="password" onChange={this.handleForm} value={this.state.user.password} />
                    </div>
                    <input type="submit" value="Login" className="btn btn-info" />
                </form>
            </div>
        );
    }
}

export default Login;
