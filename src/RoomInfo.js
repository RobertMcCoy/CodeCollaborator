import React, { Component } from 'react';
import Users from './Users';
import './RoomInfo.css';
import Toggle from './Toggle.js';

class RoomInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roomId: this.props.roomId,
            collaborators: this.props.collaborators,
            currentMode: this.props.currentMode,
            lineWrapping: this.props.lineWrapping
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            collaborators: newProps.collaborators,
            currentMode: newProps.currentMode,
            lineWrapping: newProps.lineWrapping
        });
    }

    render() {
        return (
            <div className="room-info">
                <Users collaborators={this.state.collaborators} />
                <hr/>
                <div className="new-selection">
                    <h1 className="whiteText">Current Selection</h1>
                    <select value={this.state.currentMode} onChange={this.props.modeChange}>
                        <option value="javascript">JavaScript</option>
                        <option value="htmlmixed">HTML</option>
                    </select>
                    <button>Confirm Choice</button>
                    <hr />
                    <div className="whiteText">Text Wrap</div>
                    <Toggle lineWrapCallback={this.props.lineWrapCallback} />
                </div>
            </div>
        );
    }
}

export default RoomInfo;