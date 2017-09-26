import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Collab from './Collab';

class App extends Component {

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to CodeCollab</h2>
        </div>
          <Collab id={this.getParameterByName('id')} />
      </div>
    );
  }
}

export default App;
