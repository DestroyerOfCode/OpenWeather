import React from 'react'
import WeatherCurrentService from '../../adapters/WeatherCurrentService';
import Pagination from '../current/Pagination'
import FiltersComponent from './Filters'
import { Link } from "react-router-dom";
import {getWeatherDescription, convertTemperature} from '../../businessLogic/WeatherBusinessLogic';
import '../../styles/common/Header.scss';
import { nanoid } from "nanoid";
import i18n from 'i18next'

class WeatherCurrent extends React.Component {
    constructor(props) {
        console.log(props.temperature)
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
            showPages: 5,
            language: i18n.language,
            filterComponent: null,
            temperature: props.temperature
        }
    }

    //I added temperatureDropdownList, filterscomponent and header here because I do not want to rerender them
    //on every update. I cant use shouldComponentUpdate because they either are not components or are functional
    //meaning they are stateless
    async componentDidMount() {
        console.log("componentDidMount")
        console.log(this.state.temperature)
        const countries = await WeatherCurrentService.retrieveAllCountries()
        const descriptions = await WeatherCurrentService.retrieveAllDescriptions()
        this.setState({countries : countries.data, descriptions : (descriptions.data),
            filterComponent: <FiltersComponent key={nanoid()} temperatureUnits = {this.state.temperature.units} countries = {countries.data}
            descriptions = {this.internationalizeDescriptions(descriptions.data)} onChangeMethod={this.onChangeFilter} />
        },
            function() {this.refreshWeathers()}
        )
        
    }
    
    // shouldComponentUpdate(nextProps, nextState) {
        // console.log("this.state.filters" + JSON.stringify(this.state.filters) + " nextState.filters: " + JSON.stringify(nextState.filters))
        // console.log(JSON.stringify(this.state.filters) === JSON.stringify(nextState.filters))
        // if (JSON.stringify(this.state.filters) === JSON.stringify(nextState.filters)) {
            // 
        //   return false;
        // }
        // return true;
    //   }
    // componentDidUpdate(){
    //     this.setState({description = {this.internationalizeDescriptions}})
    // }
    internationalizeDescriptions = (descriptions) => {
        return descriptions.map( (description) => (
            {"name" : i18n.t("common.description." + description.originalValue), "id": description.id, "originalValue" : description.originalValue}
        ))
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
        var index;

        if (event === "" && this.keyExistsInArr(this.state.filters,filterName))  {

            index = this.findIndexInFilters(this.state.filters, filterName)
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : false, filters : this.changeFilters(index, filterName, filterOperator)}, function () {
                this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })
        }

        else if (event !== "" && !(this.keyExistsInArr(this.state.filters, filterName))){

            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : true,
                 filters: this.state.filters.concat([{[filterName]: {[filterOperator] : event}}])}, function () {
                this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })

        }

        else if (event !== "" && (this.keyExistsInArr(this.state.filters, filterName))){
           
            index = this.findIndexInFilters(this.state.filters, filterName)

            
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : this.isAdditionalFilterCheck(event, index, filterName, filterOperator), 
                filters : this.addFilterOperatorToExistingFilterName(event, filterName, filterOperator)}, function() {
                    this.refreshWeathers(this.state.sortBy, this.state.weathers)
            })
           
        }
        else {

        }
    }

    isAdditionalFilterCheck(event, index, filterName, filterOperator){
        if (this.isNotAdditionalFilterWithContains(event) === false)
            return false
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
       return filterName === this.state.filters[index][filterName]
    }
    header(){
       return (<thead className="header">
       <tr>
           <th onClick={() =>this.refreshWeathers("_id", this.state.weathers) }>{i18n.t("current.header.cityId")}</th>
           <th onClick={() =>this.refreshWeathers("name", this.state.weathers) }>{ i18n.t('current.header.cityName')}</th>
           <th onClick={() =>this.refreshWeathers("coord.lat", this.state.weathers) }>{i18n.t("current.header.latitude")}</th>
           <th onClick={() =>this.refreshWeathers("coord.lon", this.state.weathers) }>{i18n.t("current.header.longitude")}</th>
           <th onClick={() =>this.refreshWeathers("sys.country", this.state.weathers) }>{i18n.t("current.header.country")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.humidity", this.state.weathers) }>{i18n.t("current.header.humidity")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.feels_like", this.state.weathers) }>{i18n.t("current.header.feelsLike")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp", this.state.weathers) }>{i18n.t("current.header.temperature")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_max", this.state.weathers) }>{i18n.t("current.header.maximumTemperature")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_min", this.state.weathers) }>{i18n.t("current.header.minimalTemperature")}</th>
           <th onClick={() =>this.refreshWeathers("weather.description", this.state.weathers) }>{i18n.t("current.header.description")}</th>                                
       </tr>
   </thead>)
   }

createForecast = ()=>{
    return (
        <Link  to= '/forecast'></Link>
    );
}

   mainBody(currentPosts, temperature){
       console.log(temperature.units)
    return (

    <tbody>
        {
            currentPosts.map(
                weather =>{
                    // console.log(weather.weatherMain.feels_like)
                    return (<tr key={nanoid()}>
                        <td>{weather._id}</td>
                        <td> <Link to={{pathname: "/forecast", state: {"lat": weather.coord.lat, "lon": weather.coord.lon} }}>{weather.name}</Link></td>
                        <td>{weather.coord.lat}</td>
                        <td>{weather.coord.lon}</td>
                        <td>{weather.sys.country}</td>
                        <td>{weather.weatherMain.humidity}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.feels_like)?.toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.temp)?.toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.temp_max)?.toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{`${convertTemperature(temperature.units, weather.weatherMain.temp_min)?.toFixed(2)}${temperature.abbreviation}`}</td>
                        <td>{getWeatherDescription(weather)}</td>
                    </tr>)}
            )
        }
        </tbody>
    )
   }

    paginate = (page) => {
        // if(currentPage !== 0 && currentPage <= lastPage)
       this.setState({currentPage : page}, function(){
       })

    }

    getWeathersOnSpecificPage = () => {
        const indexOfLastPost = this.state.currentPage * this.state.itemsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.itemsPerPage;
        return this.state.weathers.slice(indexOfFirstPost, indexOfLastPost);
    }

    changeLanguage = (language, i18n) => {
        i18n.changeLanguage(language);
        this.setState({}, () =>{
            this.setState({language: language})
        })
    };

    render() {
        console.log("som v render")
        console.log(this.props.temperature)
        const currentWeathers = this.getWeathersOnSpecificPage()
        const descriptions = this.internationalizeDescriptions(this.state.descriptions)
        // let filters =     (
            // this.state.filterComponent)
        
        let filters = <FiltersComponent key={nanoid()} temperatureUnits = {this.props.temperature.units} countries = {this.state.countries}
            descriptions = {this.internationalizeDescriptions(descriptions)}
            filters = {this.state.filters} onChangeMethod={this.onChangeFilter} temperature={this.props.temperature} />

        const pagination = <Pagination key={nanoid()} currentPage={this.state.currentPage} showPages={this.state.showPages}
        itemsPerPage = {this.state.itemsPerPage} totalItems = {this.state.weathers.length} paginate={this.paginate}/>

        // const temperatureDropdownListComponent = temperatureDropdownList( (units, abbreviation ) => {
            // this.setState({"temperature": {"units" : units, "abbreviation" : abbreviation}})
        // })
        let container= [filters, pagination]

        if (this.state.weathers)
            container.push(<table key={nanoid()} className="weatherTable">
                {this.header()}
                {this.mainBody(currentWeathers, this.props.temperature)}
            </table>
            )

        return (
            <div className="container">

                {container}
            </div>
        )
         
    }
}
export default WeatherCurrent
