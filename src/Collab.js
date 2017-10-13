import React, { Component } from 'react';
import './Collab.css';
import $ from 'jquery';
import { subscribeToRoom, submitCodeUpdate, leaveExistingLastRoom } from './Api';
import { ToastContainer, toast } from 'react-toastify';
import RoomInfo from './RoomInfo';
import CodeMirror from 'react-codemirror';
import 'react-toastify/dist/ReactToastify.min.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

class Collab extends Component {
    constructor(props) {
        super(props);

        let userName;
        if (this.props.userName == "" && localStorage.userName == undefined) {
            var isEntryIncorrect = true;
            while (isEntryIncorrect) {
                userName = prompt("What will you be known as on the page?");
                if (typeof(userName) == "string") {
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
            options: {lineNumbers: true, mode: 'javascript'},
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
        leaveExistingLastRoom();
        subscribeToRoom(newProps.match.params.room, this.state.userName,
            (err, roomId, socketId, connections) => this.handleConnections(err, roomId, socketId, connections),
            (err, code) => this.handleCodeUpdate(err, code),
            (err, socketId) => this.handleDisconnectingUser(err, socketId));
    }

    componentWillUnmount() {
        leaveExistingLastRoom();
    }

    componentDidMount() {
        subscribeToRoom(this.state.roomId, this.state.userName,
            (err, roomId, userName, socketId, connections) => this.handleConnections(err, roomId, userName, socketId, connections),
            (err, code) => this.handleCodeUpdate(err, code),
            (err, socketId) => this.handleDisconnectingUser(err, socketId));
    }

    render() {
        return (
            <div className="collab-container">
                <ToastContainer />
                <CodeMirror id="codeSpace" value={this.state.code} options={this.state.options} onChange={this.handleChange} />
                <RoomInfo collaborators={this.state.collaborators}/>
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
        var cursorPosition = $('#codeSpace').prop("selectionStart");
        var surroundingCharacters = { beginningCharacter: $('#codeSpace').text()[cursorPosition - 1], endingCharacter: $('#codeSpace').text()[cursorPosition] };
        this.setState({
            code: code
        });
        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.getDoc().setValue(this.state.code);
        if (code.length < cursorPosition) {
            //Code was truncated to be shorter than existing code
            $('#codeSpace').prop('selectionStart', code.length);
            $('#codeSpace').prop('selectionEnd', code.length);
        }
        else if (surroundingCharacters.beginningCharacter == code[cursorPosition - 1] && surroundingCharacters.endingCharacter == code[cursorPosition]) {
            //Code is in the same spot, don't move it
            $('#codeSpace').prop("selectionStart", cursorPosition);
            $('#codeSpace').prop("selectionEnd", cursorPosition);
        }
        else if (surroundingCharacters.beginningCharacter == code[cursorPosition - 2] && surroundingCharacters.endingCharacter == code[cursorPosition - 1]) {
            //Code was removed before the caret
            $('#codeSpace').prop('selectionStart', cursorPosition - 1)
            $('#codeSpace').prop('selectionEnd', cursorPosition - 1)
        }
        else {
            //Code was added/removed on the caret
            $('#codeSpace').prop('selectionStart', cursorPosition)
            $('#codeSpace').prop('selectionEnd', cursorPosition)
        }
    }

    handleConnections(err, roomId, socketId, userName, connections) {
        this.setState({
            roomId: roomId
        });
        if (this.state.componentSocketId === 0) {
            this.setState({
                collaborators: connections.currentConnections,
                componentSocketId: socketId,
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
}

export default Collab;
