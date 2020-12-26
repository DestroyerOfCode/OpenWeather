import React, { Component, useState, useEffec } from 'react'
import WeatherService from '../service/WeatherService';
import Pagination from './Pagination';

class WeatherListComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weathers: [],
            isAscending: true,
            filters: [],
            isFilter : false,
            currentPage : 1,
            itemsPerPage : 1000,
            loading : false,
            pageNumbers : []
        }
    }

    componentDidMount() {
        console.log("som v componentDidMOunt")
        this.refreshWeathers();
    }

    refreshWeathers(sortBy, weathers) {
        WeatherService.retrieveAllWeathers(sortBy, this.state.isAscending, this.state.filters, this.state.isFilter, weathers)
            .then(
                response => {
                    this.setState({ weathers: response.data })

                }
            ).then( () => {if (sortBy) this.setState({isAscending : !this.state.isAscending})}
            ).then( ()=>  {if (typeof this.state.filters !== 'undefined' && this.state.pageNumbers.filters == 0) this.setState({isFilter : false})})
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

    onBlurEvent(event, filterName, filterOperator){
        if (event.target.value === "" && this.keyExistsInArr(this.state.filters,filterName))  {
            this.setState({currentPage : 1})

            console.log("inside 1") 
            this.state.isFilter = true
            // this.state.currentPage = 0
            var index = this.findIndexInFilters(this.state.filters, filterName)

            if (this.state.filters[index][filterName][filterOperator])
                delete this.state.filters[index][filterName][filterOperator]  

                console.log("filters is: " + JSON.stringify(this.state.filters))
                console.log("filters length: " + this.state.filters.length)

            if (Object.keys(this.state.filters[index][filterName]).length === 0)
                this.state.filters.splice(index, 1)
                console.log("filters is: " + JSON.stringify(this.state.filters))
                console.log("filters length: " + this.state.filters.length)
                console.log("typeof this.state.filters !== 'undefined' && this.state.filters.length === 0" + typeof this.state.filters !== 'undefined' && this.state.filters.length === 0)
            if (typeof this.state.filters !== 'undefined' && this.state.filters.length === 0) this.setState({isFilter : false})

            this.refreshWeathers(this.state.sortBy, this.state.weathers)
        }

        else if (event.target.value !== "" && !(this.keyExistsInArr(this.state.filters, filterName))){
            this.setState({currentPage : 1})

            console.log("inside 2")
            this.state.isFilter = true
            // this.state.currentPage = 0

            this.state.filters.push({[filterName]: {[filterOperator] : event.target.value}})
            this.refreshWeathers(this.state.sortBy, this.state.weathers)
        }

        else if (event.target.value !== "" && (this.keyExistsInArr(this.state.filters, filterName))){
            this.setState({currentPage : 1})

            console.log("inside 3")        
            this.state.isFilter = true 
            // this.state.currentPage = 0

            this.state.filters.forEach((item, index, filters) => {
                if (item.hasOwnProperty([filterName])){
                    filters[index][filterName][filterOperator] = event.target.value
                }
            })
            this.refreshWeathers(this.state.sortBy, this.state.weathers)
        }
        else {
            console.log("inside 4")

        }
    }

   filters() {
        return (<div className="row">
        {<textarea placeholder= "Id" onBlur= {event => {this.onBlurEvent(event, "_id", "eq")}}></textarea>}
        {<textarea placeholder= "City name" onBlur= {event =>{this.onBlurEvent(event, "name", "eq")}}></textarea>}
        {<textarea placeholder= "Country" onBlur= {event =>{this.onBlurEvent(event, "sys.country", "eq")}}></textarea>}
        {<textarea placeholder= "Latitude smaller than" onBlur= {event =>{this.onBlurEvent(event, "coord.lat", "lte")}}></textarea>}
        {<textarea placeholder= "Latitude bigger than" onBlur= {event =>{this.onBlurEvent(event, "coord.lat", "gte")}}></textarea>}
        {<textarea placeholder= "Longitude smaller than" onBlur= {event =>{this.onBlurEvent(event, "coord.lon", "lte")}}></textarea>}
        {<textarea placeholder= "Longitude bigger than" onBlur= {event =>{this.onBlurEvent(event, "coord.lon", "gte")}}></textarea>}
        {<textarea placeholder= "Humidity smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.humidity", "lte")}}></textarea>}
        {<textarea placeholder= "Humidity bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.humidity", "gte")}}></textarea>}
        {<textarea placeholder= "Feel temperature smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.feels_like", "lte")}}></textarea>}
        {<textarea placeholder= "Feel temperature bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.feels_like", "gte")}}></textarea>}
        {<textarea placeholder= "Temperature smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp", "lte")}}></textarea>}
        {<textarea placeholder= "Temperature bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp", "gte")}}></textarea>}
        {<textarea placeholder= "Temperature max smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_max", "lte")}}></textarea>}
        {<textarea placeholder= "Temperature max bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_max", "gte")}}></textarea>}
        {<textarea placeholder= "Temperature min smaller than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_min", "lte")}}></textarea>}
        {<textarea placeholder= "Temperature min bigger than" onBlur= {event =>{this.onBlurEvent(event, "weatherMain.temp_min", "gte")}}></textarea>}
        {<textarea placeholder= "Description" onBlur= {event =>{this.onBlurEvent(event, "description", "eq")}}></textarea>}
    </div>)
   }

   header(){
       return (<thead>
       <tr>
           <th onClick={() =>this.refreshWeathers("_id", this.state.weathers) }>cityId</th>
           <th onClick={() =>this.refreshWeathers("name", this.state.weathers) }>city Name</th>
           <th onClick={() =>this.refreshWeathers("coord.lat", this.state.weathers) }>latitude</th>
           <th onClick={() =>this.refreshWeathers("coord.lon", this.state.weathers) }>longitude</th>
           <th onClick={() =>this.refreshWeathers("sys.country", this.state.weathers) }>country</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.humidity", this.state.weathers) }>humidity</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.feels_like", this.state.weathers) }>feels like</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp", this.state.weathers) }>temperature</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_max", this.state.weathers) }>maximum temperature</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_min", this.state.weathers) }>minimal temperature</th>
           <th onClick={() =>this.refreshWeathers("description", this.state.weathers) }>description</th>                                
       </tr>
   </thead>)
   }

   mainBody(currentPosts){
    return (

    <tbody>
        {
            currentPosts.map(
                weather =>
                    <tr key={weather._id}>
                        <td>{weather._id}</td>
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

    paginate(currentPage){
       this.setState({currentPage : currentPage})
    }

    render() {
        console.log("som v render")

        //to set page
        const paginate = (currentPage) => this.setState({currentPage : currentPage})

        const pagination = (
            <Pagination itemsPerPage = {this.state.itemsPerPage} totalItems = {this.state.weathers.length} currentPage = {1} paginate={paginate}/>
        )

        const indexOfLastPost = this.state.currentPage * this.state.itemsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.itemsPerPage;
        const currentWeathers = this.state.weathers.slice(indexOfFirstPost, indexOfLastPost);

        let container= [this.filters(), pagination]

        if (this.state.weathers)
            container.push(<table className="table">
                {this.header()}
                {this.mainBody(currentWeathers)}
            </table>)

        console.log("items per page: " + this.state.itemsPerPage)

        console.log("currentPage: " + this.state.currentPage)
       
        return (
            <div className="container">
             {container}
            </div>
        )
         
    }
}
export default WeatherListComponent
