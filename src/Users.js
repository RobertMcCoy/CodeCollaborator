import React, { Component } from 'react';
import $ from 'jquery';
import './Users.css';

class Users extends Component {
    constructor(props){
        super(props);
    }

    render () {
        return (
            <div className="users-container">
                <h1 className="users-header">Users</h1>
                <hr/>
            </div>
        );
    }
}

export default Users