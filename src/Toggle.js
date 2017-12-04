import React, { Component } from 'react';
import './RoomInfo.css';

class Toggle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggleState: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({
            toggleState: !prevState.toggleState
        }));

        this.props.lineWrapCallback();
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.toggleState ? "On" : "Off"}
            </button>
        )
    }
}

export default Toggle;