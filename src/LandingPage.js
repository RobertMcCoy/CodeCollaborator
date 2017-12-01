import React, { Component, AppRegistry, TextInput } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import './LandingPage.css';

class LandingPage extends Component {
    constructor(props){
        super(props);

        this.state={

        }
        var inputString = '';
    }

    render(){
        return(
            <div className="landing-page">
                <img src="codeCollabBanner.svg" className="banner" alt="CodeCollab Logo"/>
                <div className="section-info centered">
                <Link to='/collab'>
                  <div className="fake-button-green centered" onClick={this.getName}>Start a Collab</div>
                </Link>
                <p className='bar'>|</p>
                <input className='section-info round-input' ref={(input) => {this.inputString=input}} placeholder='Your Collab ID...'/>
                <Link to={'/collab/'+this.inputString}>
                    <div className="fake-button-purple centered">Rejoin Collab</div>
                </Link>
                </div>

                <h1 className="section-head">About the App</h1>
                <p className="section-info">Have you ever wanted to collaboratively code with your peers? Now you can. CodeCollaborator is a React application that utilizes Socket.IO to allow people to collaborate on code from any machine.</p>
                <h1 className="section-head">The Devs</h1>
                <div className="dev-section">
                    <h3>Robert</h3>
                </div>
                <div className="dev-section">
                    <h3>David</h3>
                </div>
                <div className="dev-section">
                    <h3>Brad</h3>
                </div>
            </div>
        );
    }
}

export default LandingPage;