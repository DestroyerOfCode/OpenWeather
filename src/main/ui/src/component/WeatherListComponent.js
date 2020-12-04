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

    refreshWeathers(sortBy, isAscending, filters, filterOperator) {
        console.log(isAscending + " " +  this.state.isAscending)
        WeatherService.retrieveAllWeathers(sortBy, isAscending, filters, filterOperator)
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
                <div className="row">
                    {/* <button className="btn btn-success" onClick={() => this.refreshWeathers()}>Refresh</button> */}
                    {<textarea placeholder= "Id" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"id": event.target.value}, "eq")}></textarea>}
                    {<textarea placeholder= "City name" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"name": event.target.value}, "eq")}></textarea>}
                    {<textarea placeholder= "Country" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"country": event.target.value}, "eq")}></textarea>}
                    {<textarea placeholder= "Latitude bigger than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"lat": event.target.value}, "gte")}></textarea>}
                    {<textarea placeholder= "Latitude smaller than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"lat": event.target.value}, "lte")}></textarea>}
                    {<textarea placeholder= "Longitude bigger than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"lon": event.target.value}, "gte")}></textarea>}
                    {<textarea placeholder= "Longitude smaller than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"lon": event.target.value}, "lte")}></textarea>}
                    {<textarea placeholder= "Humidity bigger than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"humidity": event.target.value}, "gte")}></textarea>}
                    {<textarea placeholder= "Humidity smaller than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"humidity": event.target.value}, "lte")}></textarea>}
                    {<textarea placeholder= "Feel temperature bigger than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"feels_like": event.target.value}, "gte")}></textarea>}
                    {<textarea placeholder= "Feel temperature smaller than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"feels_like": event.target.value}, "lte")}></textarea>}
                    {<textarea placeholder= "Temperature bigger than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"temp": event.target.value}, "gte")}></textarea>}
                    {<textarea placeholder= "Temperature smaller than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"temp": event.target.value}, "lte")}></textarea>}
                    {<textarea placeholder= "Temperature max bigger than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"temp_max": event.target.value}, "gte")}></textarea>}
                    {<textarea placeholder= "Temperature max smaller than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"temp_max": event.target.value}, "lte")}></textarea>}
                    {<textarea placeholder= "Temperature min bigger than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"temp_min": event.target.value}, "gte")}></textarea>}
                    {<textarea placeholder= "Temperature min smaller than" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"temp_min": event.target.value}, "lte")}></textarea>}
                    {<textarea placeholder= "Description" onBlur= {event => this.refreshWeathers(this.state.sortBy, this.state.isAscending, {"description": event.target.value}, "eq")}></textarea>}
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
        )
    }
}
export default WeatherListComponent
