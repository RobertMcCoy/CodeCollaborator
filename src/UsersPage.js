import React, { Component } from 'react';
import './UsersPage.css';
import './main.css';
import axios from 'axios';

class UsersPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
            user: {},
            errors: ''
        }

        this.getUserFromServer = this.getUserFromServer.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.handleResetPasswordClick = this.handleResetPasswordClick.bind(this);
    }

    componentDidMount() {
        this.getUserFromServer();
    }

    handleResetPasswordClick() {
        if (this.state.hidden === false) {
            this.setState({
                hidden: true
            });
        } else {
            this.setState({
                hidden: false
            });
        }
    }

    formatDate(date) {
        var cleanDate = new Date(date);
        var year = cleanDate.getFullYear();
        var month = cleanDate.getMonth();
        var day = cleanDate.getDate();
        return month + '/' + day + '/' + year;
    }

    render() {
        if (this.state.errors) {
            return (
                <p className="code-collab-error">{this.state.errors}</p>
            )
        } else {
            return (
                <div class="row">
                    <div className="users-page col-md-12">
                        <h2>Account Control Panel</h2>
                        <div>Name: {this.state.user.firstName} {this.state.user.lastName}</div>
                        <div>Username: {this.state.user.userName}</div>
                        <div>Email: {this.state.user.email}</div>
                        <div>Join Date: {this.formatDate(this.state.user.createdDate)}</div>
                        <br />
                        <button className="reset-pass btn btn-default" onClick={this.handleResetPasswordClick}>Click to Reset Password</button>
                        <br />
                        <br />
                        <div className={this.state.hidden ? 'hidden' : 'change-pass'}>
                            <form onSubmit={this.handleSubmit}>
                                <div class="form-group">
                                    <label for="oldPassword">Old Password:</label>
                                    <input type="password" name="oldPassword" id="oldPassword" class="form-control" onChange={this.handleOldPassField} />
                                </div>
                                <div class="form-group">
                                    <label for="newPassword">New Password:</label>
                                    <input type="password" name="newPassword" id="newPassword" class="form-control" onChange={this.handleNewPassField} />
                                </div>
                                <div class="form-group">
                                    <label for="confirmNew">Retype New Password:</label>
                                    <input type="password" name="confirmNew" id="confirmNew" class="form-control" onChange={this.handleNewPassRepeatedField} />
                                </div>
                                <input type="submit" class="btn btn-default" value="Submit" />
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    }

    getUserFromServer() {
        if (localStorage.getItem('jwtToken')) {
            var jwt = localStorage.getItem('jwtToken');
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
            axios.get('/api/profile', { jwt: jwt }).then((response) => {
                this.setState({
                    user: response.data
                });
            }).catch((response) => {
                //This needs to be displayed to the user as an error if they magically get this far
                this.setState({
                    errors: response.data
                });
            });
        }
    };
}

export default UsersPage;