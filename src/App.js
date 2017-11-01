import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Collab from './Collab';
import Register from './Register';
import LandingPage from './LandingPage';
import Login from './Login';
import { slide as Menu } from 'react-burger-menu';

class App extends Component {
  constructor(props) {
    super(props);
    this.getName = this.getName.bind(this);
  }

  getName() {
    if (localStorage.userName === undefined) {
      var isEntryIncorrect = true;
      while (isEntryIncorrect) {
        let userName = prompt("What will you be known as on the page?");
        if (typeof(userName) === "string") {
          userName = userName.trim();
          if (userName !== "") {
            localStorage.userName = userName;
            isEntryIncorrect = false;
          }
        }
        if (userName == null) {
          isEntryIncorrect = false;
        }
      }
    }
  }

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
                  <div className="menu-item" onClick={this.getName}>New Collab</div>
                </Link>
                <Link to='/register'>
                  <div className="menu-item">Register</div>
                </Link>
                <Link to='/login'>
                  <div className="menu-item">Login</div>
                </Link>
              </div>
            </Menu>
          </div>
          <Route path='/collab/:room?' render={(props) => (<Collab {...props} userName={localStorage.userName} />)} />
          <Route path='/register' component={Register} />
          <Route path='/' component={LandingPage} />
          <Route path='/login' component={Login} />
        </div>
      </Router>
    );
  }
}

export default App;
