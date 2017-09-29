import React, { Component } from 'react';
import './Collab.css';
import { subscribeToRoom, submitCodeUpdate, handleDisconnect } from './Api';

var roomId;

class Collab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: this.props.id || "",
            code: "Begin writing your code here..."
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        submitCodeUpdate(this.state.roomId, event.target.value);
        this.setState({
            code: event.target.value,
        })
    };

    componentDidMount() {
        subscribeToRoom(this.state.roomId, (err, roomId) => {
            this.setState({
                roomId: roomId
            });
            roomId = this.state.roomId;
            window.history.pushState(null, 'Collab', '/?id=' + roomId);
        }, (err, code) => {
            this.setState({
                code: code
            });
        });
    }

    render() {
        return (
            <textarea name="code" id="codeSpace" value={this.state.code} cols="30" rows="10" onChange={this.handleChange} />
        );
    }
}

export default Collab;
