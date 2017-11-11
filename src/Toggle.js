import React, { Component } from 'react';
import './Toggle.css'

class Toggle extends React.Component {
    constructor(props){
        super(props);
        this.state = {toggleState: true};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
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