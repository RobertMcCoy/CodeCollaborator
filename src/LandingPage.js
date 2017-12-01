import React, { Component } from 'react';
import './LandingPage.css';

class LandingPage extends Component {
    constructor(props){
        super(props);

        this.state={

        }
    }

    render(){
        return(
            <div className="landing-page">
                <img src="codeCollabBanner.svg" className="banner" alt="CodeCollab Logo"/>
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
                    <p>A senior at IPFW and a Software Engineer for IDEMIA.</p>
                    
                </div>
                
            </div>
        );
    }
}

export default LandingPage;