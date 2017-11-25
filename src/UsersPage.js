import React, { Component } from 'react';
import './UsersPage.css'
import axios from 'axios';

class UsersPage extends Component {
    constructor(props){
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
        if(this.state.hidden == false) {
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
        return(
            <div className="users-page">
                <h2 className="name">{this.state.user.firstName} {this.state.user.lastName}</h2>
                <br/>
                <h3 className="username">{this.state.user.userName}</h3>
                <br/>
                <h3 className="email">{this.state.user.email}</h3>
                <br/>
                <h3 className="last-login">{this.state.user.createdDate}</h3>
                <br/>
                <button className="reset-pass" onClick={this.handleResetPasswordClick}>Reset Password</button>
                <br/>
                <br/>
                <div className={this.state.hidden ? 'hidden' : 'change-pass'}>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Old Password: <input type="password" onChange={this.handleOldPassField}/>
                        </label>
                        <br/> 
                        <label>
                            New Password: <input type="password" onChange={this.handleNewPassField}/>
                        </label> 
                        <br/>
                        <label>
                            Retype New Password: <input type="password" onChange={this.handleNewPassRepeatedField}/>
                        </label> 
                        <br/>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }

    getUserFromServer() {
        var jwt = localStorage.getItem('jwtToken');
        if (jwt !== undefined && jwt !== null && jwt !== "") {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
            axios.get('http://localhost:3000/api/profile', { jwt: jwt }).then((response) => {
                console.log(response);
                this.setState({
                    user: response.data
                });
            }).catch((response) => {
                console.log(response);   
            });
        }
    };
}

export default UsersPage;