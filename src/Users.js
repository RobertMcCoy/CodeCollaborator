import React, { Component } from 'react';
import './Users.css';

class Users extends Component {
    constructor(props){
        super(props);
        this.state = {
            usersList: Array.from(props.collaborators)
        }
    }

    componentWillReceiveProps (newUsers) {
        if(JSON.stringify(this.state.usersList) !== JSON.stringify(newUsers.collaborators))
        {
            this.setState({
                usersList: Array.from(newUsers.collaborators)
            })
        }
    }

    render () {
        return (
            <div className="users-container">
                <h1 className="users-header">Users</h1>
                <hr/>
                <ul className="users-list">
                    {this.state.usersList.map(function(user){
                        return <li>{user.userName}</li>;
                    })}
                </ul>                
            </div>
        );
    }
}

export default Users
