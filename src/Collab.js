import React, { Component } from 'react';
import './Collab.css';
import $ from 'jquery';
import { subscribeToRoom, submitCodeUpdate, leaveExistingLastRoom, submitModeChange } from './Api';
import { ToastContainer, toast } from 'react-toastify';
import RoomInfo from './RoomInfo';
import CodeMirror from 'react-codemirror';
import 'react-toastify/dist/ReactToastify.min.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/xml/xml';


class Collab extends Component {
    constructor(props) {
        super(props);
        let userName;
        if (localStorage.userName === undefined && this.props.userName === undefined) {
            var isEntryIncorrect = true;
            while (isEntryIncorrect) {
                userName = prompt("What will you be known as on the page?");
                if (typeof(userName) === "string") {
                    userName = userName.trim();
                    if (userName !== "") {
                        localStorage.userName = userName;
                        isEntryIncorrect = false;
                    }
                }
                if (userName == null) {
                    isEntryIncorrect = false;
                }
            }
        }

        this.state = {
            userName: this.props.userName || localStorage.userName || "",
            roomId: this.props.match.params.room || "",
            code: '',
            options: {lineNumbers: true, mode: ''},
            collaborators: [],
            componentSocketId: 0,
            editor: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
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
        leaveExistingLastRoom();
        subscribeToRoom(newProps.match.params.room, this.state.userName,
            (err, roomId, socketId, connections) => this.handleConnections(err, roomId, socketId, connections),
            (err, code) => this.handleCodeUpdate(err, code),
            (err, socketId) => this.handleDisconnectingUser(err, socketId),
            (err, mode) => this.handleModeUpdate(err, mode));
    }

    componentWillUnmount() {
        leaveExistingLastRoom();
    }

    componentDidMount() {
        subscribeToRoom(this.state.roomId, this.state.userName,
            (err, roomId, userName, socketId, connections) => this.handleConnections(err, roomId, userName, socketId, connections),
            (err, code) => this.handleCodeUpdate(err, code),
            (err, socketId) => this.handleDisconnectingUser(err, socketId),
            (err, mode) => this.handleModeUpdate(err, mode));
        this.setState({
            editor: $('.CodeMirror')[0].CodeMirror
        })
    }

    render() {
        return (
            <div className="collab-container">
                <ToastContainer />
                <CodeMirror id="codeSpace" value={this.state.code} options={this.state.options} onChange={this.handleChange} />
                <RoomInfo roomId={this.state.roomId} collaborators={this.state.collaborators} currentMode={this.state.options.mode} modeChange={this.handleModeChange} />
            </div>
        );
    }

    handleChange(newCode) {
        submitCodeUpdate(this.state.roomId, newCode);
        this.setState({
            code: newCode,
        })
    };

    handleCodeUpdate(err, code) {
        this.setState({
            code: code
        });
        this.state.editor.getDoc().setValue(this.state.code);
    }

    handleConnections(err, roomId, socketId, userName, connections) {
        this.setState({
            roomId: roomId
        });
        if (this.state.componentSocketId === 0) {
            this.setState({
                collaborators: connections.currentConnections,
                componentSocketId: socketId,
                options: {lineNumbers: true, mode: connections.currentMode}
            });
            this.addNotificationAlert("You joined the page! You are known as: " + userName);
        }
        else {
            this.setState(previousState => ({
                collaborators: connections.currentConnections
            }));
            this.addNotificationAlert("A new user has connected: " + userName);
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

    handleModeChange(event) {
        this.setState({
            options: {lineNumbers: true, mode: event.target.value}
        })
        submitModeChange(this.state.roomId, event.target.value);
    }

    handleModeUpdate(err, mode) {
        this.setState({
            options: {lineNumbers: true, mode: mode}
        });
        this.addNotificationAlert("Mode has been changed to: " + mode);
    }
}

export default Collab;
