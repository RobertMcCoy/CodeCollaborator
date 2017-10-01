import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Collab from './Collab';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <Link to='/'>
              <div className="branding-container">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>CodeCollab</h2>
              </div>
            </Link>
            <ul className="header-links">
              <Link to='/'>
                <li>Home</li>
              </Link>
              <Link to='/collab'>
                <li>New Collab</li>
              </Link>
            </ul>
          </div>
          <Route path='/collab/:room?' component={Collab} />
        </div>
      </Router>
    );
  }
}

export default App;
