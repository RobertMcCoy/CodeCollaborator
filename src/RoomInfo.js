import React, { Component } from 'react'
import Users from './Users';
import './RoomInfo.css';

class RoomInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            roomId: this.props.roomId,
            collaborators: this.props.collaborators,
            currentMode: this.props.currentMode
        }
    }

    componentWillReceiveProps (newProps) {
        this.setState({
            collaborators: newProps.collaborators,
            currentMode: newProps.currentMode
        });
    }

    render () {
        return (
            <div className="room-info">   
                <Users collaborators={this.state.collaborators}/>
                <hr/>
                <div className="new-selection">
                    <h1>Current Selection</h1>
                    <select value={this.state.currentMode} onChange={this.props.modeChange}>
                        <option value="javascript">JavaScript</option>
                        <option value="htmlmixed">HTML</option>
                    </select> 
                    <button>Confirm Choice</button>
                </div>
            </div>
        );
    }
}

export default RoomInfo;