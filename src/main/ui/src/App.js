import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import WeatherApp from './component/WeatherApp';

// class App extends Component {
//   constructor () {
//     super()
//     this.handleClick = this.handleClick.bind(this)
//   }
//   handleClick () {
//     axios.get('https://api.github.com/users/maecapozzi')
//       .then(response => this.setState({username: response.data.name}))
//     }
//   render () {
//     return (
//       <div className='button__container'>
//         <button className='button' onClick={this.handleClick}>
//           Click Me
//         </button>
//       </div>
//     )
//   }
// }
// export default App

// class App extends React.Component { 

// 	constructor(props) {
// 		super(props);
// 		this.state = {weather: []};
// 	}

// 	componentDidMount() {
// 		client({method: 'GET', path: '/retrieve/fromDb'}).done(response => {
// 			this.setState({weather: response.entity._embedded.weather});
// 		});
// 	}

// 	render() {
// 		return (
// 			<WeatherList weather={this.state.weather}/>
// 		)
// 	}


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
