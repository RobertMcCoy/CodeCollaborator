import React, { Component } from 'react';
import './Collab.css';
import $ from 'jquery';
import { subscribeToRoom, submitCodeUpdate } from './Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Collab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: this.props.match.params.room || "",
            code: "",
            collaborators: [],
            componentSocketId: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    addNotificationAlert(message) {
        toast(message);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            roomId: newProps.match.params.room,
            componentSocketId: 0,
            collaborators: [],
            code: ''
        })
        subscribeToRoom(newProps.match.params.room,
            (err, roomId, socketId, connections) => this.handleConnections(err, roomId, socketId, connections), 
            (err, code) => this.handleCodeUpdate(err, code), 
            (err, socketId) => this.handleDisconnectingUser(err, socketId));
    }
    
    componentDidMount() {
        subscribeToRoom(this.state.roomId, 
            (err, roomId, socketId, connections) => this.handleConnections(err, roomId, socketId, connections), 
            (err, code) => this.handleCodeUpdate(err, code), 
            (err, socketId) => this.handleDisconnectingUser(err, socketId));
    }

    render() {
        return (
            <div className="collab-container">
                <ToastContainer />
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

    handleConnections(err, roomId, socketId, connections) {
        this.setState({
            roomId: roomId
        });
        if (this.state.componentSocketId === 0) {
            this.setState({
                collaborators: [socketId],
                componentSocketId: socketId,
            });
            this.addNotificationAlert("You joined the page! You are known as: " + socketId);
        }
        else {
            this.setState(previousState => ({
                collaborators: connections.currentConnections
            }));
            this.addNotificationAlert("A new user has connected: " + socketId);
        }
        if (!window.location.href.includes('/collab/')) {
            window.history.pushState(null, '', '/collab/' + roomId);
        }
        else {
            window.history.pushState(null, '', roomId);
        }
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
