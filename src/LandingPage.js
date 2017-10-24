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
                <h1>Code Collaborator</h1>
                <h3>Code together, anywhere, anytime.</h3>
                <h1 className="section-head">About the App</h1>
                <p className="section-info">Insert cool stuff about the app here.</p>
                <h1 className="section-head">About the Developers</h1>
                <p className="section-info">Insert cool stuff about the devs here.</p>
            </div>
        );
    }
}

export default LandingPage;