import React, { Component } from 'react'
import './App.css'
import WeatherApp from './components/WeatherApp';

class App extends Component {
  render() {
    return (
      <div className="container">
        <WeatherApp />
      </div>
    );
  }
}

export default App;
