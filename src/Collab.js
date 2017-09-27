import React, { Component } from 'react';
import { subscribeToRoom, submitCodeUpdate, unsubscribeFromRoom } from './Api';

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
    };

    handleLeave(roomId) {
        unsubscribeFromRoom(roomId);
    };

    componentWillUnmount() {
        this.handleLeave();
        window.removeEventListener('beforeunload', this.handleLeave)
    };

    componentDidMount() {
        subscribeToRoom(this.state.roomId, (err, roomId) => {
            this.setState({
                roomId: roomId
            });
            window.history.pushState(null, 'Collab', '/?id=' + roomId);
        }, (err, code) => {
            this.setState({
                code: code
            });
        });

        window.addEventListener('beforeunload', this.handleLeave(this.state.roomId));
    }

    render() {
        return (
            <textarea name="code" id="codeSpace" value={this.state.code} cols="30" rows="10" onChange={this.handleChange} />
        );
    }
}

export default Collab;
