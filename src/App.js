import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

var tw = 1500000;

function getTimeRemaining(consumed = 0) {
  var t = tw - consumed;
  tw = t;
  var minute = Math.floor((t/1000/60) % 60);
  var seconds = Math.floor((t/1000) % 60);
  return {
    minute, seconds
  };
}

function initializedClock() {
  var timeInterval = setInterval(() => {
    var timex = getTimeRemaining(1000);
    console.log(timex.minute,' : ',timex.seconds);
    if (timex.t <= 0) {
      clearInterval(timeInterval);
    }
  }, 1000);
}

initializedClock();


export default App;
