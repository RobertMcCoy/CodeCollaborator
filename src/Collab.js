import React, { Component } from 'react';
import './Collab.css';
import { subscribeToRoom, submitCodeUpdate } from './Api';
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr; // This is a React Element.

var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);


class Collab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: this.props.id || "",
            code: "Begin writing your code here...",
            collaborators: [],
            componentSocketId: 0,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        submitCodeUpdate(this.state.roomId, event.target.value);
        this.setState({
            code: event.target.value,
        })
    };

    addNotificationAlert(message) {
        this.container.success(
            message,
            "New Connection",
            {
                timeOut: 5000,
                extendedTimeOut: 2500,
                closeButton: true,
                preventDuplicates: true
            }
        );
    }

    componentDidMount() {
        subscribeToRoom(this.state.roomId,
            (err, roomId, socketId) => {
                this.setState({
                    roomId: roomId
                });
                roomId = this.state.roomId;
                if (this.state.componentSocketId === 0) {
                    this.setState({
                        componentSocketId: socketId,
                    });
                    this.addNotificationAlert("You joined the page! You are known as: " + socketId);
                }
                else {
                    this.setState(previousState => ({
                        collaborators: [...previousState, socketId],
                    }));
                    this.addNotificationAlert("A new user has connected: " + socketId);
                }
                window.history.pushState(null, '', '/?id=' + roomId);
            }, (err, code) => {
                this.setState({
                    code: code
                });
            });
    }

    render() {
        return (
            <div className="collab-container">
                <ToastContainer ref={(input) => { this.container = input; }} toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
                <textarea name="code" id="codeSpace" value={this.state.code} cols="30" rows="10" onChange={this.handleChange} />
            </div>
        );
    }
}

export default Collab;
