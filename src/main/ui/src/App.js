import React, { Component } from 'react'
import './App.css'
import WeatherApp from './components/WeatherApp';
import {nanoid} from 'nanoid'

class App extends Component {
  render() {
    return (
      <div key={nanoid()}className="container">
        <WeatherApp />
      </div>
    );
  }
}

export default App;
