import React, { useState, useEffect} from "react";
import WeatherForecastService from '../service/WeatherForecastService';
import {getWeatherDescription, convertTemperature} from '../businessLogic/WeatherBusinessLogic';
import Dropdown from 'react-bootstrap/Dropdown'

 function WeatherForecastComponent(props){

    console.log("som vo forecast component")
    console.log("props: " + JSON.stringify(props.history.location.state))

    const [dailyWeatherForecast, setDailyWeatherForecast] = useState({} )
    const [temperatureUnits, setTemperatureUnits] = useState("")
    
    useEffect(() =>{
       
            console.log("som v useEffect forecast component")
           console.log("func: " )
           WeatherForecastService.getDailyForecastByCityName(props.history.location.state.lat,props.history.location.state.lon, "Current,Hourly,Minutely").
           then( response => setDailyWeatherForecast(response.data)) 
        //    console.log("res: " + JSON.stringify(res))
        //    setDailyWeatherForecast(res);
         }, [props.history.location.state.lat, props.history.location.state.lon])

    // setDailyWeatherForecast(getDailyWeatherForecast(props.history.location.state.lat, props.history.location.state.lon).data)
    console.log("dailyWeatherForecast: " + JSON.stringify(dailyWeatherForecast))
    return (
    <div>

        <tbody>
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            Temperature units converter
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => convertTemperature("kelvin", "celsius")}>Kelvin</Dropdown.Item>
                <Dropdown.Item onClick={() => convertTemperature("kelvin", "celsius")}>Cslsius</Dropdown.Item>
                <Dropdown.Item onClick={() => convertTemperature("kelvin", "celsius")}>Fahrenheit</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
            <table className="table">
                {createHeader.call()}
                {createMainBody(dailyWeatherForecast)}
            </table>
        </tbody>
    </div>)
}

const createMainBody = (dailyWeatherForecast) => {
    return (
        dailyWeatherForecast?.daily?.map(dailyWeather =>{
            return( 
                <tr key ={ dailyWeather.dt}>
                    <td>{displayDateTime(new Date(dailyWeather.dt * 1000))}</td>
                    <td>{displayDateTime(new Date(dailyWeather.sunrise * 1000))}</td>
                    <td>{displayDateTime(new Date(dailyWeather.sunset * 1000))}</td>
                    <td>{dailyWeather.temp.day}</td>
                    <td>{dailyWeather.temp.min}</td>
                    <td>{dailyWeather.temp.max}</td>
                    <td>{dailyWeather.temp.night}</td>
                    <td>{dailyWeather.temp.eve}</td>
                    <td>{dailyWeather.temp.morn}</td>
                    <td>{dailyWeather.feels_like.day}</td>
                    <td>{dailyWeather.feels_like.night}</td>
                    <td>{dailyWeather.feels_like.eve}</td>
                    <td>{dailyWeather.feels_like.morn}</td>
                    <td>{dailyWeather.dew_point}</td>
                    <td>{dailyWeather.wind_speed}</td>
                    <td>{dailyWeather.wind_deg}</td>
                    <td>{dailyWeather.weather[0].icon}</td>
                    <td>{dailyWeather.weather[0].id}</td>
                    <td>{getWeatherDescription(dailyWeather)}</td>
                    <td>{dailyWeather.weather[0].main}</td>
                    <td>{dailyWeather.clouds}</td>
                    <td>{dailyWeather.pop}</td>
                    <td>{dailyWeather.uvi}</td>
                    <td>{dailyWeather.rain}</td>
                    <td>{dailyWeather.snow}</td>
                </tr>)
        })
    )
}

const displayDateTime = (dateTime) => {
    return dateTime.toLocaleString("sk-SK")
}

const createHeader = () => {
    return ( 
    <thead>
        <tr>
            <th>dt</th>
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
            <th>dew point</th>
            <th>wind speed</th>
            <th>wind deg</th>
            <th>icon</th>
            <th>id</th>
            <th>description</th>
            <th>main</th>
            <th>clouds</th>
            <th>pop</th>
            <th>uvi</th>
            <th>rain</th>
            <th>snow</th>
        </tr>
    </thead>)
}
export default WeatherForecastComponent