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
            <img src={logo} className="App-logo" alt="logo" />
            <h2>CodeCollab</h2>
            <ul className="header-link">
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/collab'>New Collab</Link></li>
            </ul>
          </div>   
          <Route path='/collab/:room?' component={ Collab } />
        </div>
      </Router>

    );
  }
}

export default App;
