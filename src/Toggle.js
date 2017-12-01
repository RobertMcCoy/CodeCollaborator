import React, { Component } from 'react';
import './RoomInfo.css';

class Toggle extends React.Component {
    constructor(props){
        super(props);
        this.state = {toggleState: false};
        var handleLineWrap = () => {
            this.props.handleLineWrap();
        }
        this.handleClick = this.handleClick.bind(this);        
    }

    handleClick(){
        this.handleLineWrap();
        this.setState(prevState => ({
            toggleState: !prevState.toggleState
        }));
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