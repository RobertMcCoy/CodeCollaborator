import React, { Component } from 'react';
import './Users.css';

class Users extends Component {
    constructor(props){
        super(props);

        this.state = {
            usersList: []
        }
    }

    componentWillReceiveProps (newUsers) {
        this.setState({
            usersList: newUsers.collaborators
        });
    }

    render () {
        return (
            <div className="users-container">
                <h1 className="users-header">Users</h1>
                <hr/>
                <ul className="users-list">
                    {this.state.usersList.map(function(user, i){
                        return <li key={ i }>{user.userName}</li>;
                    })}
                </ul>                
            </div>
        );
    }
}

export default Users
