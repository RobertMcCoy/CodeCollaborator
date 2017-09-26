import React, { Component } from 'react';
import { subscribeToRoom, getCodeUpdate, submitCodeUpdate } from './Api';

class Collab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: this.props.id || "",
            code: "Begin writing your code here..."
        };

        subscribeToRoom((err, roomId, message) => {
                this.setState({
                    roomId: roomId,
                    message: message
                });
                window.history.pushState({}, 'Collab', '/?id=' + roomId);
            }
        );

        getCodeUpdate((err, roomId, code) =>
            this.setState({
                roomId: roomId,
                code: code
            })
        );

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        submitCodeUpdate(this.props.roomId, event.target.value);
    };

    componentDidMount() {
        console.log(this.state.roomId);
    }

    render() {
        return (
            <textarea name="code" id="codeSpace" value={this.state.code} cols="30" rows="10" onChange={this.handleChange} />
        );
    }
}

export default Collab;
