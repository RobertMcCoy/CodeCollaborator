import React, { Component } from 'react';
import { BrowserRouter as Link, Router, Route } from 'react-router-dom';
import Collab from './Collab';
import './LandingPage.css';

class LandingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputString: ""
        }

        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        this.setState({
            inputString: e.target.value
        });
    }

    render() {
        return (
            <div className="landing-page">
                <img src="codeCollabBanner.svg" className="banner" alt="CodeCollab Logo" />
                <div className="row row-align-center">
                    <div className="col-md-4">
                        <a href='/collab'>
                            <div className="btn btn-green" onClick={this.getName}>Start a Collab</div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <input className='btn btn-input' onChange={this.handleInput} value={this.state.inputString} placeholder='Your Collab ID...' />
                    </div>
                    <div className="col-md-4">
                        <a href={'/collab/' + this.state.inputString}>
                            <div className="btn btn-purple">Rejoin Collab</div>
                        </a>
                    </div>
                </div>
                <h2 className="section-head">About the App</h2>
                <p className="section-info">Have you ever wanted to collaboratively code with your peers? Now you can. CodeCollaborator is a React application that utilizes Socket.IO to allow people to collaborate on code from any device.</p>
                <h2 className="section-head">The Devs</h2>
                <div className="row">
                    <div className="dev-section col-md-4 col-xs-12">
                        <h3>Robert</h3>
                        <img src="assets/images/rmccoy.jpg" alt="Robert Profile" />
                        <p>Senior at IPFW and Web Developer at Aptera, Inc. Enjoys gifs of puppies far more than he probably should.</p>
                    </div>
                    <div className="dev-section col-md-4 col-xs-12">
                        <h3>David</h3>
                        <img src="assets/images/dm_profilepicture_close.jpg" alt="David Profile" />
                        <p>Senior at IPFW, enjoys software development and long walks on the beach.</p>
                    </div>
                    <div className="dev-section col-md-4 col-xs-12">
                        <h3>Brad</h3>
                        <p>A senior at IPFW and a Software Engineer for IDEMIA.</p>
                    </div>
                </div>

            </div>
        );
    }
}

export default LandingPage;