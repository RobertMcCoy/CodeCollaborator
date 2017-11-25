import React, { Component } from 'react';
import './Login.css';
import axios from 'axios';

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

        this.handleForm = this.handleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.user.username === undefined || this.state.user.password === undefined || this.state.user.username === "" || this.state.user.password === "") {
            this.setState({
                errors: {
                    badLogin: "Must provide username and password"
                }
            });
        } else {
            axios.post('http://localhost:3000/auth/login', {
                    'username': this.state.user.username,
                    'password': this.state.user.password,
                }).then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('jwtToken', response.data.token);
                        console.log('Would now be routing you to profile');
                    }
                }).catch((response) => {
                    localStorage.setItem('jwtToken', '');
                    this.setState({
                        errors: {
                            badLogin: "Username/password are incorrect. Please try again."
                        }
                    })
                });
        }
    }

    handleForm(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        this.setState({
            user
        });
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
                    {this.state.errors.badLogin && <p>*{this.state.errors.badLogin}</p>}
                    <input type="submit" value="Login" className="btn btn-info" />
                </form>
            </div>
        );
    }
}

export default Login;
