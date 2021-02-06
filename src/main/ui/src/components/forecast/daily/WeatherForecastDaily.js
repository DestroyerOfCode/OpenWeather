import React, { useState, useEffect} from "react";
import WeatherForecastService from '../../../adapters/WeatherForecastService';
import {getWeatherDescription, displayDateTime, convertTemperature} from '../../../businessLogic/WeatherBusinessLogic';
import {temperatureDropdownList} from '../../../buildingBlocks/commonBuildingBlocks.js'
import {getWeatherMain, getWeatherId, getWeatherIcon} from '../../../businessLogic/forecast/WeatherForecastLogic'
 function WeatherForecastComponent(props){

    console.log("som vo forecast component")
    console.log("props: " + JSON.stringify(props.history.location.state))

    const [dailyWeatherForecast, setDailyWeatherForecast] = useState({} )
    const [temperature, setTemperature] = useState({units : "celsius", abbreviation : "°C"})
    
    useEffect(() =>{
       
        console.log("som v useEffect forecast component")
        WeatherForecastService.getDailyForecastByCityName(props.history.location.state.lat,props.history.location.state.lon, "Current,Hourly,Minutely")
        .then( response => setDailyWeatherForecast(response.data)) 
        }, [props.history.location.state.lat, props.history.location.state.lon])

    return (
    <div>
        <tbody>
            <div>
                {temperatureDropdownList( (units, abbreviation ) => {
                    setTemperature({"units" : units, "abbreviation" : abbreviation})})
                    }
            </div>
            <div>
                <table className="table">
                    {createHeader.call()}
                    {createMainBody(dailyWeatherForecast,  temperature)}
                </table>
            </div>
        </tbody>
    </div>)
}

const createMainBody = (dailyWeatherForecast, temperature) => {
    return (
        dailyWeatherForecast?.daily?.map(dailyWeather =>{
            return( 
                <tr key ={ dailyWeather.dt}>
                    <td>{displayDateTime(new Date(dailyWeather.sunrise * 1000))}</td>
                    <td>{displayDateTime(new Date(dailyWeather.sunset * 1000))}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.temp.day).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.temp.min).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.temp.max).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.temp.night).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.temp.eve).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.temp.morn).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.feels_like.day).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.feels_like.night).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.feels_like.eve).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{`${convertTemperature(temperature.units, dailyWeather.feels_like.morn).toFixed(2)}${temperature.abbreviation}`}</td>
                    <td>{dailyWeather.wind_speed}</td>
                    <td>{dailyWeather.wind_deg}</td>
                    <td>{getWeatherDescription(dailyWeather)}</td>
                </tr>)
        })
    )
}

const createHeader = () => {
    return ( 
    <thead>
        <tr>
            <th>sunrise</th>
            <th>sunset</th>
            <th>temp</th>
            <th>min</th>
            <th>max</th>
            <th>night</th>
            <th>evening</th>
            <th>morning</th>
            <th>feels like day</th>
            <th>feels like night</th>
            <th>feels like evening</th>
            <th>feels like morning</th>
            <th>wind speed</th>
            <th>wind deg</th>
            <th>description</th>
        </tr>
    </thead>)
}
export default WeatherForecastComponent