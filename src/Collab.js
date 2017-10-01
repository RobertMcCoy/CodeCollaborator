import React, { Component } from 'react';
import './Collab.css';
import $ from 'jquery';
import { subscribeToRoom, submitCodeUpdate } from './Api';
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr; // This is a React Element.

var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);


class Collab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: this.props.id || "",
            code: "",
            collaborators: [],
            componentSocketId: 0,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    
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
            (err, roomId, socketId) => this.handleConnections(err, roomId, socketId), 
            (err, code) => this.handleCodeUpdate(err, code), 
            (err, socketId) => this.handleDisconnectingUser(err, socketId));
    }

    render() {
        return (
            <div className="collab-container">
                <ToastContainer ref={(input) => { this.container = input; }} toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
                <textarea name="code" id="codeSpace" value={this.state.code} cols="30" rows="10" onChange={this.handleChange} />
            </div>
        );
    }

    handleChange(event) {
        submitCodeUpdate(this.state.roomId, event.target.value);
        this.setState({
            code: event.target.value,
        })
    };

    handleCodeUpdate(err, code) {
        var cursorPosition = $('#codeSpace').prop("selectionStart");
        this.setState({
            code: code
        });
        $('#codeSpace').prop("selectionStart", cursorPosition);
        $('#codeSpace').prop("selectionEnd", cursorPosition);
    }

    handleConnections(err, roomId, socketId) {
        this.setState({
            roomId: roomId,
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
    }

    handleDisconnectingUser(err, socketId) {
        var leaverIndex = this.state.collaborators.indexOf(socketId);
        this.setState({
            collaborators: this.state.collaborators.splice(leaverIndex, 1)
        })
        this.addNotificationAlert("A user has disconnected: " + socketId);
    }
}

export default Collab;
