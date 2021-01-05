import React, { Component } from 'react'
import WeatherService from '../service/WeatherService';
import Pagination from './Pagination';
import { Multiselect } from 'multiselect-react-dropdown';

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
            isAdditionalFilter : false,
            pageNumbers : [],
            countries : [],
            descriptions: []
        }
    }

    async componentDidMount() {
        console.log("som v componentDidMOunt")
        const countries = await WeatherService.retrieveAllCountries()
        const descriptions = await WeatherService.retrieveAllDescriptions()
        this.setState({countries : countries.data, descriptions : descriptions.data}, function() {this.refreshWeathers();})
        
    }

    refreshWeathers(sortBy, weathers) {

        WeatherService.retrieveAllWeathers(sortBy, this.state.isAscending, this.state.filters, this.state.isFilter, this.state.isAdditionalFilter, weathers)
            .then(
                response => {
                    this.setState({ weathers: response.data })
                }
            ).then( () => {if (sortBy) this.setState({isAscending : !this.state.isAscending})}
            ).then( () => {if (typeof this.state.filters !== 'undefined' && this.state.pageNumbers.filters === 0) this.setState({isFilter : false})})
    }

    keyExistsInArr(arr, key){
        let exists = false
        console.log("arr inside keyExists: " + JSON.stringify(arr))
        if (!Array.isArray(key)){
            arr?.some(item => {
                if(item.hasOwnProperty([key])) {
                    exists = true;
                    return true
                }
                else return false
            })
        }
        //since countries and descriptions is a multicheckbox, they are arrays and it has multiple keys and must check not with equals
        else{
            arr?.some(item => {
                if(item.includes([key])) {
                    exists = true;
                    return true
                }
                else return false
            })
        }
        return exists
    }

    findIndexInFilters(arr, key){
        let indexOfKey = 0
        arr?.some((filterName, index, filters) => {
            if(filterName.hasOwnProperty([key])){ 
                indexOfKey = index
                return indexOfKey
            }
            else return false
        })
        return indexOfKey
    }

    changeFilters(index, filterName, filterOperator) {
        let arr = this.state.filters
        console.log("arr inside changefilters: " + JSON.stringify(arr))

        if (arr[index][filterName][filterOperator])
            delete arr[index][filterName][filterOperator]  
        if (Object.keys(arr[index][filterName]).length === 0)
            arr.splice(index, 1)
        return arr
    }

    addFilterOperatorToExistingFilterName = (event, filterName, filterOperator) => {
        const arr = this.state.filters
        arr.forEach((item, index, filters) => {
            if (item.hasOwnProperty([filterName])){
                filters[index][filterName][filterOperator] = event
            }
        })
        return arr
    }

    onBlurEvent(event, filterName, filterOperator){
        console.log("event: " + JSON.stringify(event))
        console.log("filters: " + JSON.stringify(this.state.filters))

        if (event === "" && this.keyExistsInArr(this.state.filters,filterName))  {
            var index = this.findIndexInFilters(this.state.filters, filterName)
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : false, filters : this.changeFilters(index, filterName, filterOperator)}, function () {
                this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })
        }

        else if (event !== "" && !(this.keyExistsInArr(this.state.filters, filterName))){
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : true,
                 filters: this.state.filters.concat([{[filterName]: {[filterOperator] : event}}])}, function () {
                console.log("filters inside: " + this.state.filters)
                this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })

        }

        else if (event !== "" && (this.keyExistsInArr(this.state.filters, filterName))){
            //if there are multiple countries and descriptions, backend must make a new query
            //since no additional filter is added, only value. I am unable to send query request
            //with an array element
            const isAdditionalFilterWithContains = event.includes(",") ? false : true
            
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : isAdditionalFilterWithContains, 
                filters : this.addFilterOperatorToExistingFilterName(event, filterName, filterOperator)}, function() {
                    this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })
           
        }
        else {
            console.log("inside 4")

        }
    }

    // this closure's purpose is to create strings to be sent to query params, as no 
    // other way to send arrays exists
   makeStringFromSelectedItems = (items) => {
        var selectedItemsIntoString = (prevVal, currVal, idx) => {
            return idx === 0 ? currVal.name : prevVal + "," + currVal.name
        }
        return items.reduce(selectedItemsIntoString, '')
   }

   filters() {
    //    console.log("coutnries: " + JSON.stringify(this.state.countries))
        return (<div className="row">
        {<textarea placeholder= "Id" onBlur= {event => {this.onBlurEvent(event.target.value, "_id", "eq")}}></textarea>}
        {<textarea placeholder= "City   name" onBlur= {event =>{this.onBlurEvent(event.target.value, "name", "eq")}}></textarea>}
        {<Multiselect options ={this.state.countries} displayValue='name'  onSelect={event =>{this.onBlurEvent(this.makeStringFromSelectedItems(event), "sys.country", "in")}}
        onRemove={event =>{this.onBlurEvent(this.makeStringFromSelectedItems(event), "sys.country", "in")}}/>}
        {<textarea placeholder= "Country" onBlur= {event =>{this.onBlurEvent(event.target.value, "sys.country", "eq")}}></textarea>}
        {<textarea placeholder= "Latitude smaller than" onBlur= {event =>{this.onBlurEvent(event.target.value, "coord.lat", "lte")}}></textarea>}
        {<textarea placeholder= "Latitude bigger than" onBlur= {event =>{this.onBlurEvent(event.target.value, "coord.lat", "gte")}}></textarea>}
        {<textarea placeholder= "Longitude smaller than" onBlur= {event =>{this.onBlurEvent(event.target.value, "coord.lon", "lte")}}></textarea>}
        {<textarea placeholder= "Longitude bigger than" onBlur= {event =>{this.onBlurEvent(event.target.value, "coord.lon", "gte")}}></textarea>}
        {<textarea placeholder= "Humidity smaller than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.humidity", "lte")}}></textarea>}
        {<textarea placeholder= "Humidity bigger than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.humidity", "gte")}}></textarea>}
        {<textarea placeholder= "Feel temperature smaller than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.feels_like", "lte")}}></textarea>}
        {<textarea placeholder= "Feel temperature bigger than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.feels_like", "gte")}}></textarea>}
        {<textarea placeholder= "Temperature smaller than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.temp", "lte")}}></textarea>}
        {<textarea placeholder= "Temperature bigger than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.temp", "gte")}}></textarea>}
        {<textarea placeholder= "Temperature max smaller than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.temp_max", "lte")}}></textarea>}
        {<textarea placeholder= "Temperature max bigger than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.temp_max", "gte")}}></textarea>}
        {<textarea placeholder= "Temperature min smaller than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.temp_min", "lte")}}></textarea>}
        {<textarea placeholder= "Temperature min bigger than" onBlur= {event =>{this.onBlurEvent(event.target.value, "weatherMain.temp_min", "gte")}}></textarea>}
        {<Multiselect options ={this.state.descriptions} displayValue='name'  onSelect={event =>{this.onBlurEvent(this.makeStringFromSelectedItems(event), "weather.description", "in")}}
        onRemove={event =>{this.onBlurEvent(this.makeStringFromSelectedItems(event), "weather.description", "in")}}/>}

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
           <th onClick={() =>this.refreshWeathers("weather.description", this.state.weathers) }>description</th>                                
       </tr>
   </thead>)
   }

   // descriptions can be multiple per row, to display it I changed its elements to string delimetered by ','
    getWeatherDescription = (weather) => {
        var weatherItemReduce = (prevVal, currVal, idx) => {
            return idx === 0 ? currVal.description : prevVal + ", " + currVal.description;
        }

        return weather.weather.reduce(weatherItemReduce, '')
    }



   mainBody(currentPosts){
    return (

    <tbody>
        {
            currentPosts.map(
                weather =>{
                    return (<tr key={weather._id}>
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
                        <td>{this.getWeatherDescription(weather)}</td>
                    </tr>)}
            )
        }
        </tbody>
    )
   }

    paginate = (currentPage) => {
       this.setState({currentPage : currentPage})
    }

    render() {
        console.log("som v render")

        const pagination = <Pagination itemsPerPage = {this.state.itemsPerPage} totalItems = {this.state.weathers.length} paginate={this.paginate.bind()}/>
        const indexOfLastPost = this.state.currentPage * this.state.itemsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.itemsPerPage;
        const currentWeathers = this.state.weathers.slice(indexOfFirstPost, indexOfLastPost);

        let container= [this.filters(), pagination]

        if (this.state.weathers)
            container.push(<table className="table">
                {this.header()}
                {this.mainBody(currentWeathers)}
            </table>)

        return (
            <div className="container">
             {container}
            </div>
        )
         
    }
}
export default WeatherListComponent
