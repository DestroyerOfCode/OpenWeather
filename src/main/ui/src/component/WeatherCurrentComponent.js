import React, { Component } from 'react'
import WeatherCurrentService from '../service/WeatherCurrentService';
import Pagination from './Pagination';
import FiltersComponent from './FiltersComponent'
import { Link } from "react-router-dom";
import {getWeatherDescription, displayDateTime, convertTemperature} from '../businessLogic/WeatherBusinessLogic';
import {temperatureDropdownList} from '../buildingBlocks/commonBuildingBlocks'

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
            descriptions: [],
            temperature: {units: 'celsius', abbreviation: '°C'},            
        }
    }

    async componentDidMount() {
        console.log("som v componentDidMOunt weather list")
        const countries = await WeatherCurrentService.retrieveAllCountries()
        const descriptions = await WeatherCurrentService.retrieveAllDescriptions()
        this.setState({countries : countries.data, descriptions : descriptions.data}, function() {this.refreshWeathers();})
        
    }

    refreshWeathers(sortBy, weathers) {

        WeatherCurrentService.retrieveAllWeathers(sortBy, this.state.isAscending, this.state.filters, this.state.isFilter, this.state.isAdditionalFilter, weathers)
            .then(
                response => {
                    this.setState({ weathers: response.data })
                }
            ).then( () => {if (sortBy) this.setState({isAscending : !this.state.isAscending})}
            ).then( () => {if (typeof this.state.filters !== 'undefined' && this.state.filters === 0) this.setState({isFilter : false})})
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

    onChangeFilter = (event, filterName, filterOperator) => {
        // console.log("event: " + JSON.stringify(event))
        // console.log("filters: " + JSON.stringify(this.state.filters))

        if (event === "" && this.keyExistsInArr(this.state.filters,filterName))  {
            console.log("inside 1")

            var index = this.findIndexInFilters(this.state.filters, filterName)
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : false, filters : this.changeFilters(index, filterName, filterOperator)}, function () {
                this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })
        }

        else if (event !== "" && !(this.keyExistsInArr(this.state.filters, filterName))){
            console.log("inside 2")

            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : true,
                 filters: this.state.filters.concat([{[filterName]: {[filterOperator] : event}}])}, function () {
                // console.log("filters inside: " + this.state.filters)
                this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })

        }

        else if (event !== "" && (this.keyExistsInArr(this.state.filters, filterName))){
           
            console.log("inside 3")
            var index = this.findIndexInFilters(this.state.filters, filterName)

            
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : this.isAdditionalFilterCheck(event, index, filterName, filterOperator), 
                filters : this.addFilterOperatorToExistingFilterName(event, filterName, filterOperator)}, function() {
                    this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })
           
        }
        else {
            console.log("inside 4")

        }
    }

    isAdditionalFilterCheck(event, index, filterName, filterOperator){
        if (this.isNotAdditionalFilterWithContains(event) === false)
            return false
        console.log("this.state.filters[index][filterName][filterOperator]: " + this.state.filters[index][filterName][filterOperator])
        if (this.isSameFilterChanged(event, index, filterName, filterOperator) === false)
            return false
        return true
                
    }   

    //if there are multiple countries and descriptions, backend must make a new query
    //since no additional filter is added, only value. I am unable to send query request
    //with an array element
    isNotAdditionalFilterWithContains(event){
       return event.includes(",") ? false : true
    }
    
    // this check is here for times when I change the same filter multiple
    // times in a row and the filter is same. If it is the same I cant filter
    // from memory because I could not load some weathers
    isSameFilterChanged(event, index, filterName, filterOperator){
        console.log("event: " + event)
        console.log("this.state.filters[index][filterName][filterOperator]: " + this.state.filters[index][filterName][filterOperator])
       return filterName === this.state.filters[index][filterName]
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

createForecast = ()=>{
    console.log("dfs")
    return (
        <Link  to= '/forecast'></Link>
    );
}

   mainBody(currentPosts, temperature){
    return (

    <tbody>
        {
            currentPosts.map(
                weather =>{
                    return (<tr key={weather._id}>
                        <td>{weather._id}</td>
                        <td> <Link to={{pathname: "/forecast", state: {"lat": weather.coord.lat, "lon": weather.coord.lon} }}>{weather.name}</Link></td>
                        <td>{weather.coord.lat}</td>
                        <td>{weather.coord.lon}</td>
                        <td>{weather.sys.country}</td>
                        <td>{weather.weatherMain.humidity}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.feels_like).toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.temp).toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.temp_max).toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.temp_min).toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{this.getWeatherDescription(weather)}</td>
                    </tr>)}
            )
        }
        </tbody>
    )
   }

    paginate = (currentPage) => {
       this.setState({currentPage : currentPage}, function(){
           console.log("currPage: " + this.state.currentPage)
       })

    }

    getWeathersOnSpecificPage = () => {
        console.log('after pagination creation')
        const indexOfLastPost = this.state.currentPage * this.state.itemsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.itemsPerPage;
        return this.state.weathers.slice(indexOfFirstPost, indexOfLastPost);
    }

    render() {
        console.log("som v render weather list")

        const pagination = <Pagination itemsPerPage = {this.state.itemsPerPage} totalItems = {this.state.weathers.length} paginate={this.paginate.bind()}/>

        const currentWeathers = this.getWeathersOnSpecificPage()
        const filters = <FiltersComponent countries = {this.state.countries} descriptions = {this.state.descriptions} onChangeMethod={this.onChangeFilter} />
        const temperatureDropdown = temperatureDropdownList( (units, abbreviation ) => {
            this.setState({"temperature": {"units" : units, "abbreviation" : abbreviation}})})

        let container= [temperatureDropdown, filters, pagination]

        if (this.state.weathers)
            container.push(<table className="table">
                {this.header()}
                {this.mainBody(currentWeathers, this.state.temperature)}
            </table>)

        return (
            <div className="container">
             {container}
            </div>
        )
         
    }
}
export default WeatherListComponent
