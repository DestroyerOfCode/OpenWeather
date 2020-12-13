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

    refreshWeathers(sortBy, isFilter, weathers) {
        WeatherService.retrieveAllWeathers(sortBy, this.state.isAscending, this.state.filters,  isFilter, weathers)
            .then(
                response => {
                    this.setState({ weathers: response.data })

                }
            ).then( () => {if (sortBy) this.setState({isAscending : !this.state.isAscending})})
    }

    keyExistsInArr(arr, key){
        var exists = false
        arr?.some(item => {
            if(item.hasOwnProperty([key])) exists = true
        })
        return exists
    }

    findIndexInFilters(arr, key){
        var indexOfKey = 0
        arr?.some((filterName, index, filters) => {
            if(filterName.hasOwnProperty([key])){ 
                indexOfKey = index

            }
        })
        return indexOfKey
    }

    onBlurEvent(event, filterName, filterOperator, isFilter){
        if (event.target.value === "" && this.keyExistsInArr(this.state.filters,filterName))  {
            console.log("inside 1")
            var index = this.findIndexInFilters(this.state.filters, filterName)

            if (this.state.filters[index][filterName][filterOperator])
                delete this.state.filters[index][filterName][filterOperator]  

            if (Object.keys(this.state.filters[index][filterName]).length === 0)
                this.state.filters.splice(index, 1)

            this.refreshWeathers(this.state.sortBy, isFilter, this.state.weathers)
        }

        else if (event.target.value !== "" && !(this.keyExistsInArr(this.state.filters, filterName))){
            console.log("inside 2")

            this.state.filters.push({[filterName]: {[filterOperator] : event.target.value}})
            this.refreshWeathers(this.state.sortBy, isFilter, this.state.weathers)
        }

        else if (event.target.value !== "" && (this.keyExistsInArr(this.state.filters, filterName))){
            console.log("inside 3")
            this.state.filters.forEach((item, index, filters) => {
                if (item.hasOwnProperty([filterName])){
                    filters[index][filterName][filterOperator] = event.target.value
                }
            })

            this.refreshWeathers(this.state.sortBy, isFilter, this.state.weathers)
        }
        else {
            console.log("inside 4")

        }
    }

   filters() {
        return (<div className="row">
        {<textarea placeholder= "Id" onBlur= {event => {this.onBlurEvent(event, "id", "eq", true) }}></textarea>}
        {<textarea placeholder= "City name" onBlur= {event =>{this.onBlurEvent(event, "name", "eq", true)}}></textarea>}
        {<textarea placeholder= "Country" onBlur= {event =>{this.onBlurEvent(event, "sys.country", "eq", true)}}></textarea>}
        {<textarea placeholder= "Latitude smaller than" onBlur= {event =>{this.onBlurEvent(event, "coord.lat", "lte", true)}}></textarea>}
        {<textarea placeholder= "Latitude bigger than" onBlur= {event =>{this.onBlurEvent(event, "coord.lat", "gte", true)}}></textarea>}
        {<textarea placeholder= "Longitude smaller than" onBlur= {event =>{this.onBlurEvent(event, "coord.lon", "lte", true)}}></textarea>}
        {<textarea placeholder= "Longitude bigger than" onBlur= {event =>{this.onBlurEvent(event, "coord.lon", "gte", true)}}></textarea>}
        {<textarea placeholder= "Humidity smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.humidity", "lte", true)}}></textarea>}
        {<textarea placeholder= "Humidity bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.humidity", "gte", true)}}></textarea>}
        {<textarea placeholder= "Feel temperature smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.feels_like", "lte", true)}}></textarea>}
        {<textarea placeholder= "Feel temperature bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.feels_like", "gte", true)}}></textarea>}
        {<textarea placeholder= "Temperature smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp", "lte", true)}}></textarea>}
        {<textarea placeholder= "Temperature bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp", "gte", true)}}></textarea>}
        {<textarea placeholder= "Temperature max smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_max", "lte", true)}}></textarea>}
        {<textarea placeholder= "Temperature max bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_max", "gte", true)}}></textarea>}
        {<textarea placeholder= "Temperature min smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_min", "lte", true)}}></textarea>}
        {<textarea placeholder= "Temperature min bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_min", "gte", true)}}></textarea>}
        {<textarea placeholder= "Description" onBlur= {event =>{this.onBlurEvent(event, "description", "eq", true)}}></textarea>}
    </div>)
   }

   header(){
       return (<thead>
       <tr>
           <th onClick={() =>this.refreshWeathers("id", false, this.state.weathers) }>cityId</th>
           <th onClick={() =>this.refreshWeathers("name", false, this.state.weathers) }>city Name</th>
           <th onClick={() =>this.refreshWeathers("coord.lat", false, this.state.weathers) }>latitude</th>
           <th onClick={() =>this.refreshWeathers("coord.lon", false, this.state.weathers) }>longitude</th>
           <th onClick={() =>this.refreshWeathers("sys.country", false, this.state.weathers) }>country</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.humidity", false, this.state.weathers) }>humidity</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.feels_like", false, this.state.weathers) }>feels like</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp", false, this.state.weathers) }>temperature</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_max", false, this.state.weathers) }>maximum temperature</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_min", false, this.state.weathers) }>minimal temperature</th>
           <th onClick={() =>this.refreshWeathers("description", false, this.state.weathers) }>description</th>                                
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
