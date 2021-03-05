import React, { useState, useEffect} from "react";
import WeatherForecastService from '../../../adapters/WeatherForecastService';
import {getWeatherDescription, displayDateTime, convertTemperature} from '../../../businessLogic/WeatherBusinessLogic';
import '../../../styles/common/Header.scss'
import i18n from 'i18next'
import '../../../i18n'
import { Link } from "react-router-dom";
 function WeatherForecastComponent(props){

    const [dailyWeatherForecast, setDailyWeatherForecast] = useState({})
    const temperature = props.temperature
    console.log(temperature)
    console.log(props)
    useEffect(() =>{
       
        WeatherForecastService.getDailyForecastByCityName(props.history.location.state.lat,props.history.location.state.lon, "Current,Hourly,Minutely")
        .then( response => setDailyWeatherForecast(response.data)) 
        }, [props.history.location.state.lat, props.history.location.state.lon])
        console.log(props.location.state.filters !== undefined)
    return (
    <div>
         <Link to= {{pathname: "/", state: {"filters": props.location.state.filters, "isFromForecast": true, "isFilter": props.location.state.filters !== undefined, "currentWeathers": props.location.state.currentWeathers}}}>
            <button>{i18n.t("forecast.currentWeather")}</button>
        </Link>
            <table className="weatherTable">
                {createHeader.call()}
                {createMainBody(dailyWeatherForecast,  temperature)}
            </table>
    </div>)
}

const createMainBody = (dailyWeatherForecast, temperature) => {
    return (
        <tbody>
        {
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
        }
        </tbody>

    )
}

const createHeader = () => {
    return ( 
    <thead>
        <tr>
            <th>{i18n.t("forecast.header.sunrise")}</th>
            <th>{i18n.t("forecast.header.sunset")}</th>
            <th>{i18n.t("forecast.header.temp")}</th>
            <th>{i18n.t("forecast.header.min")}</th>
            <th>{i18n.t("forecast.header.max")}</th>
            <th>{i18n.t("forecast.header.night")}</th>
            <th>{i18n.t("forecast.header.evening")}</th>
            <th>{i18n.t("forecast.header.morning")}</th>
            <th>{i18n.t("forecast.header.feelsLikeDay")}</th>
            <th>{i18n.t("forecast.header.feelsLikeNight")}</th>
            <th>{i18n.t("forecast.header.feelsLikeEvening")}</th>
            <th>{i18n.t("forecast.header.feelsLikeMorning")}</th>
            <th>{i18n.t("forecast.header.windSpeed")}</th>
            <th>{i18n.t("forecast.header.windDeg")}</th>
            <th>{i18n.t("forecast.header.description")}</th>
        </tr>
    </thead>)
}
export default WeatherForecastComponent