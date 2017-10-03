import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Collab from './Collab';
import { slide as Menu } from 'react-burger-menu';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="menu">
            <Menu>
              <Link to='/'>
                <div className="app-header menu-item">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h2>CodeCollab</h2>
                </div>
              </Link>
              <div className="header-links">
                <Link to='/'>
                  <div className="menu-item">Home</div>
                </Link>
                <Link to='/collab'>
                  <div className="menu-item">New Collab</div>
                </Link>
              </div>
            </Menu>
          </div>
          <Route path='/collab/:room?' component={Collab} />
        </div>
      </Router>
    );
  }
}

export default App;
