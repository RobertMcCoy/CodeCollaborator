import React, { Component } from 'react';
import { subscribeToRoom, getCodeUpdate, submitCodeUpdate } from './Api';

class Collab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: "",
            code: "",
        };
        subscribeToRoom((err, roomId) => this.setState({
            roomId: roomId
        }));
        getCodeUpdate((err, roomId, code) =>
            this.setState({
                roomId: roomId,
                code: code
            }));
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        submitCodeUpdate(this.props.roomId, event.target.value);
    };

    render() {
        return (
            <textarea name="code" id="codeSpace" cols="30" rows="10" onChange={this.handleChange}>{this.props.code}</textarea>
        );
    }
}

export default Collab;
