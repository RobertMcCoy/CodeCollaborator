import React, { Component } from 'react'
import Users from './Users';
import './RoomInfo.css';

class RoomInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            collaborators: this.props.collaborators
        }
    }

    componentWillReceiveProps (newProps) {
        this.setState({
            collaborators: newProps.collaborators
        });
    }

    render () {
        return (
            <div className="room-info">   
                <Users collaborators={this.state.collaborators}/>
                <hr/>
            </div>
        );
    }
}

export default RoomInfo;