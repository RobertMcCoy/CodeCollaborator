import React, { Component } from 'react';
import './UsersPage.css'
import axios from 'axios';

class UsersPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
            user: {}
        }

        this.getUserFromServer = this.getUserFromServer.bind(this);
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

    render() {
        return (
            <div className="users-page">
                <h2 className="name">{this.state.user.firstName} {this.state.user.lastName}</h2>
                <br />
                <h3 className="username">{this.state.user.userName}</h3>
                <br />
                <h3 className="email">{this.state.user.email}</h3>
                <br />
                <h3 className="last-login">{this.state.user.createdDate}</h3>
                <br />
                <button className="reset-pass" onClick={this.handleResetPasswordClick}>Reset Password</button>
                <br />
                <br />
                <div className={this.state.hidden ? 'hidden' : 'change-pass'}>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Old Password: <input type="password" onChange={this.handleOldPassField} />
                        </label>
                        <br />
                        <label>
                            New Password: <input type="password" onChange={this.handleNewPassField} />
                        </label>
                        <br />
                        <label>
                            Retype New Password: <input type="password" onChange={this.handleNewPassRepeatedField} />
                        </label>
                        <br />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
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
            });
        }
    };
}

export default UsersPage;