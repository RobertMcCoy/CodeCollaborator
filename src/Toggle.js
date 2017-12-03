import React, { Component } from 'react';
import './RoomInfo.css';

class Toggle extends React.Component {
    constructor(props){
        super(props);
        this.state = {toggleState: false};
        var handleLineWrap = () => {
            this.props.handleLineWrap;
        }

        this.props.lineWrapCallback = () => {
            this.props.lineWrappingCallbackRoomInfo(this.state.toggleState);
        }

        this.handleClick = this.handleClick.bind(this);
    }

    

    handleClick(){
        this.setState(prevState => ({
            toggleState: !prevState.toggleState
        }));
        this.lineWrapCallback();
    }

    render(){
        return (
            <button onClick={this.handleClick}>
                {this.state.toggleState ? "On":"Off"}
            </button>
        )
    }

}

export default Toggle;