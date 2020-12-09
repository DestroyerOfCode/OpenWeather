import React, { Component } from 'react'
import WeatherService from '../service/WeatherService';

class WeatherListComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weathers: [],
            isAscending: true,
            filters: []
        }
    }

    componentDidMount() {
        this.refreshWeathers();
    }

    refreshWeathers(sortBy, filterOperator, weathers) {
            // console.log("filters: " + JSON.stringify(filters))
        WeatherService.retrieveAllWeathers(sortBy, this.state.isAscending, this.state.filters, filterOperator, weathers)
            .then(
                response => {
                    this.setState({ weathers: response.data })

                }
            ).then( () => {if (sortBy) this.setState({isAscending : !this.state.isAscending})})
    }

    onBlurEvent(event, filterName, filterOperator){
        if (event)  {
            console.log("filterName: " + filterName)
            console.log("filteeeeeeeeeeeeeer: " + JSON.stringify({[filterName]: event.target.value}))
            this.state.filters.push({[filterName]: event.target.value})
            this.refreshWeathers(this.state.sortBy, filterOperator, this.state.weathers)
        }
    }
   filters() {
        return (<div className="row">
        {<textarea placeholder= "Id" onBlur= {event => {this.onBlurEvent(event, "id", "eq") }}></textarea>}
        {<textarea placeholder= "City name" onBlur= {event =>{this.onBlurEvent(event, "name", "eq",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Country" onBlur= {event =>{this.onBlurEvent(event, "country", "eq",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Latitude smaller than" onBlur= {event =>{this.onBlurEvent(event, "lat", "lte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Latitude bigger than" onBlur= {event =>{this.onBlurEvent(event, "lat", "gte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Longitude smaller than" onBlur= {event =>{this.onBlurEvent(event, "lon", "lte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Longitude bigger than" onBlur= {event =>{this.onBlurEvent(event, "lon", "gte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Humidity smaller than" onBlur= {event =>{this.onBlurEvent(event, "humidity", "lte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Humidity bigger than" onBlur= {event =>{this.onBlurEvent(event, "humidity", "gte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Feel temperature smaller than" onBlur= {event =>{this.onBlurEvent(event, "feels_like", "lte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Feel temperature bigger than" onBlur= {event =>{this.onBlurEvent(event, "feels_like", "gte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Temperature smaller than" onBlur= {event =>{this.onBlurEvent(event, "temp", "lte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Temperature bigger than" onBlur= {event =>{this.onBlurEvent(event, "temp", "gte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Temperature max smaller than" onBlur= {event =>{this.onBlurEvent(event, "temp_max", "lte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Temperature max bigger than" onBlur= {event =>{this.onBlurEvent(event, "temp_max", "gte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Temperature min smaller than" onBlur= {event =>{this.onBlurEvent(event, "temp_min", "lte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Temperature min bigger than" onBlur= {event =>{this.onBlurEvent(event, "temp_min", "gte",this.state.weathers)}}></textarea>}
        {<textarea placeholder= "Description" onBlur= {event =>{this.onBlurEvent(event, "description", "eq",this.state.weathers.weathers)}}></textarea>}
    </div>)
   }

   header(){
       return (<thead>
       <tr>
           <th onClick={() =>this.refreshWeathers("id",'', this.state.weathers) }>cityId</th>
           <th onClick={() =>this.refreshWeathers("name",'', this.state.weathers) }>city Name</th>
           <th onClick={() =>this.refreshWeathers("coord.lat",'', this.state.weathers) }>latitude</th>
           <th onClick={() =>this.refreshWeathers("coord.lon",'', this.state.weathers) }>longitude</th>
           <th onClick={() =>this.refreshWeathers("sys.country", '', '', this.state.weathers) }>country</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.humidity",'', this.state.weathers) }>humidity</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.feels_like",'', this.state.weathers) }>feels like</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp",'', this.state.weathers) }>temperature</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_max",'', this.state.weathers) }>maximum temperature</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_min",'', this.state.weathers) }>minimal temperature</th>
           <th onClick={() =>this.refreshWeathers("description",'', this.state.weathers) }>description</th>                                
       </tr>
   </thead>)
   }

   mainBody(){
    return (

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

                    </tr>
            )
        }
        </tbody>
    )
   }

    render() {

        let container= [this.filters()]
        if (this.state.weathers)
            container.push(<table className="table">
            {this.header()}
            {this.mainBody()}
        </table>)

        return (
            <div className="container">
             {container}
            </div>
        )
         
    }
}
export default WeatherListComponent
