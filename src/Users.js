import React, { Component } from 'react';
import './Users.css';

class Users extends Component {
    constructor(props){
        super(props);

        this.state = {
            usersList: this.props.collaborators
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
                <h2 className="users-header">Users</h2>
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
