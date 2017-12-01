import React, { Component, AppRegistry, TextInput } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import './LandingPage.css';

class LandingPage extends Component {
    constructor(props){
        super(props);

        this.state={
            inputString:""
        }
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e){
        this.setState({inputString: e.target.value});
    }

    render(){
        return(
            <div className="landing-page">
                <img src="codeCollabBanner.svg" className="banner" alt="CodeCollab Logo"/>
                <div className="row row-align-center">
                    <div className="col-md-2"></div>
                    <Link to='/collab'>
                        <div className="col-md-2 btn btn-green" onClick={this.getName}>Start a Collab</div>
                    </Link>
                    <input className='col-md-3 btn btn-input' onChange={this.handleInput} value={this.state.inputValue} placeholder='Your Collab ID...'/>
                    <Link to={'/collab/'+this.state.inputString}>
                        <div className="col-md-2 btn btn-purple">Rejoin Collab</div>
                    </Link>
                    <div className="col-md-2"></div>
                </div>

                <h1 className="section-head">About the App</h1>
                <p className="section-info">Have you ever wanted to collaboratively code with your peers? Now you can. CodeCollaborator is a React application that utilizes Socket.IO to allow people to collaborate on code from any machine.</p>
                <h1 className="section-head">The Devs</h1>
                <div className="dev-section">
                    <h3>Robert</h3>
                </div>
                <div className="dev-section">
                    <h3>David</h3>
                    <img src="dm_profilepicture_close.jpg"/>
                    <p>Senior at IPFW, enjoys software development and long walks on the beach.</p>
                </div>
                <div className="dev-section">
                    <h3>Brad</h3>
                </div>
            </div>
        );
    }
}

export default LandingPage;