import React, { Component } from 'react';
import './UsersPage.css';

class UsersPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            hidden: true,
            oldPass: '',
            newPass: '',
            newPassRepeated: ''
        }
        this.handleResetPasswordClick = this.handleResetPasswordClick.bind(this);
        this.handleOldPassField = this.handleOldPassField.bind(this);
        this.handleNewPassField = this.handleNewPassField.bind(this);
        this.handleNewPassRepeatedField = this.handleNewPassRepeatedField.bind(this);
    }

    handleResetPasswordClick () {
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

    handleOldPassField(event) {
        this.setState({
            oldPass: event.target.value
        });
    }

    handleNewPassField(event) {
        this.setState({
            newPass: event.target.value
        });
    }

    handleNewPassRepeatedField(event) {
        this.setState({
            newPassRepeated: event.target.value
        });
    }

    render () {
        return(
            <div className="users-page">
                <h1 className="name">FirstName LastName</h1>
                <br/>
                <h3 className="last-login">userName</h3>
                <br/>
                <h3 className="last-login">lastLogin</h3>
                <br/>
                <button className="reset-pass" onClick={this.handleResetPasswordClick}>Reset Password</button>
                <br/>
                <br/>
                <div className={this.state.hidden ? 'hidden' : 'change-pass'}>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Old Password: <input type="password" value={this.state.oldPass} onChange={this.handleOldPassField}/>
                        </label>
                        <br/> 
                        <label>
                            New Password: <input type="password" value={this.state.newPass} onChange={this.handleNewPassField}/>
                        </label> 
                        <br/>
                        <label>
                            Retype New Password: <input type="password" value={this.state.newPassRepeated} onChange={this.handleNewPassRepeatedField}/>
                        </label> 
                        <br/>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }
}

export default UsersPage;