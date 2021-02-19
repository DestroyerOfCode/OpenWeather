import React from 'react'
import WeatherCurrentService from '../../adapters/WeatherCurrentService';
import Pagination from '../current/Pagination'
import FiltersComponent from './Filters'
import { Link } from "react-router-dom";
import {getWeatherDescription, 
    convertTemperature,
    keyExistsInArr,
    findIndexInFilters,
    changeFilters,
    addFilterOperatorToExistingFilterName,
    isAdditionalFilterCheck,
    displayCoords
    } from '../../businessLogic/WeatherBusinessLogic';
import '../../styles/common/Header.scss';
import { nanoid } from "nanoid";
import i18n from 'i18next'

class WeatherCurrent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentWeathers:  props?.location?.state?.currentWeathers !== undefined ? props.location.state.currentWeathers : [] ,
            isAscending: true,
            filters: props?.location?.state?.filters !== undefined ? props.location.state.filters : [] ,
            isFilter : props?.location?.state?.isFilter === true ,
            currentPage : 1,
            itemsPerPage : 100,
            isAdditionalFilter : false,
            pageNumbers : [],
            showPages: 5,
            filterComponent: null,
            temperature: props.temperature
        }
    }

    async componentDidMount() {
        console.log("componentDidMount")
        console.log(this.state.temperature)
        const descriptions = async(internationalize) => {let desc =await WeatherCurrentService.retrieveAllDescriptions(); console.log(desc); return  internationalize(desc)}
        const countries = async(internationalize) => {let countries =await WeatherCurrentService.retrieveAllCountries(); console.log(countries); return  internationalize(countries)}
        this.setState({
            filterComponent: <FiltersComponent key={nanoid()} temperatureUnits = {this.state.temperature.units} countries = {countries(this.internationalizeCountries)}
            descriptions = {descriptions(this.internationalizeDescriptions)} onChangeMethod={this.onChangeFilter} />
        },
            function() {console.log(this.props);if (this.props?.location?.state?.isFromForecast !== true) this.refreshWeathers()}
        )
    }

    internationalizeDescriptions = (descriptions) => {
        console.log(descriptions.data)
        return descriptions.data.map( (description) => (
            {"name" : i18n.t("common.description." + description.originalValue), "id": description.id, "originalValue" : description.originalValue}
        ))
    }

    internationalizeCountries = (countries) => {
        console.log(countries.data)
        return countries.data.map( (country) => {
            return {"countryName" : i18n.t("common.countryName." + country.originalCountryName), "id": country.code, "originalCountryName" : country.originalCountryName}
        })
    }
    refreshWeathers(sortBy, currentWeathers) {
        console.log(this.state)
        console.log("som v refresh")
        WeatherCurrentService.retrieveAllWeathers(sortBy, this.state.isAscending, this.state.filters, this.state.isFilter, this.state.isAdditionalFilter, currentWeathers)
            .then(
                response => {
                    this.setState({ currentWeathers: response.data })
                }
            ).then( () => {if (sortBy) this.setState({isAscending : !this.state.isAscending})}
            ).then( () => {if (typeof this.state.filters !== 'undefined' && this.state.filters === 0) this.setState({isFilter : false})})
    }

    onChangeFilter = (event, filterName, filterOperator) => {
        var index;
        if (event === "" && keyExistsInArr(this.state.filters,filterName))  {
            index = findIndexInFilters(this.state.filters, filterName)
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : false, filters : changeFilters(index, filterName, filterOperator, this.state.filters)}, function () {
                this.refreshWeathers(this.state.sortBy, this.state.currentWeathers)
            })
        }

        else if (event !== "" && !(keyExistsInArr(this.state.filters, filterName))){
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : true,
                 filters: this.state.filters.concat([{[filterName]: {[filterOperator] : event}}])}, function () {
                this.refreshWeathers(this.state.sortBy, this.state.currentWeathers)
            })
        }

        else if (event !== "" && (keyExistsInArr(this.state.filters, filterName))){
           
            index = findIndexInFilters(this.state.filters, filterName)
            this.setState({currentPage : 1, isFilter : true, isAdditionalFilter : isAdditionalFilterCheck(event, index, filterName, this.state.filters), 
                filters : addFilterOperatorToExistingFilterName(event, filterName, filterOperator, this.state.filters)}, function() {
                    this.refreshWeathers(this.state.sortBy, this.state.currentWeathers)
            })
        }
    }

    header(){
       return (<thead className="header">
       <tr>
           <th onClick={() =>this.refreshWeathers("_id", this.state.currentWeathers) }>{i18n.t("current.header.cityId")}</th>
           <th onClick={() =>this.refreshWeathers("name", this.state.currentWeathers) }>{ i18n.t('current.header.cityName')}</th>
           <th onClick={() =>this.refreshWeathers("coord.lat", this.state.currentWeathers) }>{i18n.t("current.header.latitude")}</th>
           <th onClick={() =>this.refreshWeathers("coord.lon", this.state.currentWeathers) }>{i18n.t("current.header.longitude")}</th>
           <th onClick={() =>this.refreshWeathers("sys.countryName", this.state.currentWeathers) }>{i18n.t("current.header.country")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.humidity", this.state.currentWeathers) }>{i18n.t("current.header.humidity")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.feels_like", this.state.currentWeathers) }>{i18n.t("current.header.feelsLike")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp", this.state.currentWeathers) }>{i18n.t("current.header.temperature")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_max", this.state.currentWeathers) }>{i18n.t("current.header.maximumTemperature")}</th>
           <th onClick={() =>this.refreshWeathers("weatherMain.temp_min", this.state.currentWeathers) }>{i18n.t("current.header.minimalTemperature")}</th>
           <th onClick={() =>this.refreshWeathers("weather.description", this.state.currentWeathers) }>{i18n.t("current.header.description")}</th>                                
       </tr>
   </thead>)
   }

   mainBody(currentPosts, temperature){
       console.log(temperature.units)
    return (
    <tbody>
        {
            currentPosts.map(
                weather =>{
                    return (<tr key={nanoid()}>
                        <td>{weather._id}</td>
                        <td> <Link to={{pathname: "/forecast", state: {"lat": weather.coord.lat, "lon": weather.coord.lon, "filters": this.state.filters, "currentWeathers": this.state.currentWeathers} }}>{weather.name}</Link></td>
                        <td>{displayCoords(weather.coord.lat)}</td>
                        <td>{displayCoords(weather.coord.lon)}</td>
                        <td>{i18n.t(`common.countryName.${weather.sys.countryName}`)}</td>
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
       this.setState({currentPage : page})
    }

    getWeathersOnSpecificPage = () => {
        const indexOfLastPost = this.state.currentPage * this.state.itemsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.itemsPerPage;
        return this.state.currentWeathers.slice(indexOfFirstPost, indexOfLastPost);
    }

    render() {
        console.log("som v render")
        console.log(this.props)
        const currentPaginatedWeathers = this.getWeathersOnSpecificPage()
        let descriptions = async(internationalize) => internationalize(await WeatherCurrentService.retrieveAllDescriptions())
        let countries = async(internationalize) => internationalize(await WeatherCurrentService.retrieveAllCountries())

        let filters = <FiltersComponent key={nanoid()} temperatureUnits = {this.props.temperature.units} countries = {countries(this.internationalizeCountries)}
            descriptions = {descriptions(this.internationalizeDescriptions)}
            filters = {this.state.filters} onChangeMethod={this.onChangeFilter} temperature={this.props.temperature} />

        const pagination = <Pagination key={nanoid()} currentPage={this.state.currentPage} showPages={this.state.showPages}
        itemsPerPage = {this.state.itemsPerPage} totalItems = {this.state.currentWeathers.length} paginate={this.paginate}/>
        let container= [filters, pagination]

        if (this.state.currentWeathers)
            container.push(<table key={nanoid()} className="weatherTable">
                {this.header()}
                {this.mainBody(currentPaginatedWeathers, this.props.temperature)}
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
