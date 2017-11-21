import React, { Component } from 'react';
import './UsersPage.css';

class UsersPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            hidden: false,
            oldPass: '',
            newPass: '',
            newPassRepeated: ''
        }
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
                <button className="reset-pass">Reset Password</button>

                <div className={this.state.hidden ? 'hidden' : 'change-pass'}>
                    <h3>Old Password: <input value={this.state.oldPass}/></h3> 
                    <h3>New Password: <input value={this.state.newPass}/></h3>
                    <h3>Retype New Password: <input value={this.state.newPassRepeated}/></h3>
                    <button className='submit-button'>Submit</button>
                </div>
            </div>
        );
    }
}

export default UsersPage;