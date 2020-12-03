import React, { Component } from 'react'
import WeatherService from '../service/WeatherService';

class WeatherListComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weathers: [],
            sortBy: "name",
            isAscending : true,
        }
        // this.deleteWeatherClicked = this.deleteWeatherClicked.bind(this)
        // this.updateWeatherClicked = this.updateWeatherClicked.bind(this)
        // this.addWeatherClicked = this.addWeatherClicked.bind(this)
        // this.refreshWeathers = this.refreshWeathers.bind(this)
    }

    componentDidMount() {
        this.refreshWeathers(this.state.sortBy, this.state.isAscending);
    }

    refreshWeathers(sortBy, isAscending) {
        console.log(isAscending + " " +  this.state.isAscending)
        WeatherService.retrieveAllWeathers(sortBy, isAscending)
            .then(
                response => {
                    //console.log(response);
                    this.setState({ weathers: response.data })
                }
            ).then( r => {
            this.setState({isAscending: !isAscending})})
    }

    render() {
        console.log('render')
        return (
            <div className="container">
                <h3>All Weathers</h3>
                <div className="container">
                    <div className="row">
                        {/* <button className="btn btn-success" onClick={() => this.refreshWeathers()}>Refresh</button> */}
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() =>this.refreshWeathers("id", this.state.isAscending) }>cityId</th>
                                <th onClick={() =>this.refreshWeathers("name", this.state.isAscending) }>city Name</th>
                                <th onClick={() =>this.refreshWeathers("coord.lat", this.state.isAscending) }>latitude</th>
                                <th onClick={() =>this.refreshWeathers("coord.lon", this.state.isAscending) }>longitude</th>
                                <th onClick={() =>this.refreshWeathers("sys.country", this.state.isAscending) }>country</th>
                                <th onClick={() =>this.refreshWeathers("weatherMain.humidity", this.state.isAscending) }>humidity</th>
                                <th onClick={() =>this.refreshWeathers("weatherMain.feels_like", this.state.isAscending) }>feels like</th>
                                <th onClick={() =>this.refreshWeathers("weatherMain.temp", this.state.isAscending) }>temperature</th>
                                <th onClick={() =>this.refreshWeathers("weatherMain.temp_max", this.state.isAscending) }>maximum temperature</th>
                                <th onClick={() =>this.refreshWeathers("weatherMain.temp_min", this.state.isAscending) }>minimal temperature</th>
                                <th onClick={() =>this.refreshWeathers("weather.description", this.state.isAscending) }>description</th>                                
                                {/* <th>Update</th> */}
                                {/* <th>Delete</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.weathers.map(
                                    weather =>
                                        <tr key={weather.id}>
                                            <td>{weather.id}</td>
                                            <td>{weather.name}</td>
                                            <td>{weather.coord.lat}</td>
                                            <td>{weather.coord.lon}</td>
                                            <td>{weather.sys.country}</td>
                                            <td>{weather.weatherMain.humidity}</td>
                                            <td>{weather.weatherMain.feels_like}</td>
                                            <td>{weather.weatherMain.temp}</td>
                                            <td>{weather.weatherMain.temp_max}</td>
                                            <td>{weather.weatherMain.temp_min}</td>
                                            <td>{weather.weather[0].description}</td>

                                            {/* <td><button className="btn btn-success" onClick={() => this.updateCourseClicked(course.id)}>Update</button></td> */}
                                            {/* <td><button className="btn btn-warning" onClick={() => this.deleteCourseClicked(course.id)}>Delete</button></td> */}
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {/* <div className="row"> */}
                        {/* <button className="btn btn-success" onClick={this.addCourseClicked}>Add</button> */}
                    {/* </div> */}
                </div>
            </div>
        )
    }
}
export default WeatherListComponent
