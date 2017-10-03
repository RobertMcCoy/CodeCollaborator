import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Collab from './Collab';
import { slide as Menu } from 'react-burger-menu';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: ""
    }

    this.getName = this.getName.bind(this);
  }

  getName() {
    let getUserName = prompt("What name will you go by on the page?");
    this.setState({
      userName: getUserName || ""
    });
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
                  <div className="menu-item" onClick={ this.getName }>New Collab</div>
                </Link>
              </div>
            </Menu>
          </div>
          <Route path='/collab/:room?' render={(props) => (<Collab {...props} userName={this.state.userName} />)} />
        </div>
      </Router>
    );
  }
}

export default App;
