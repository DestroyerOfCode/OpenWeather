import axios from 'axios'
import React, { Component } from 'react'

const COURSE_API_URL = 'http://localhost:8080'

const WEATHER_FORECAST_API_URL = `${COURSE_API_URL}/weather/forecast`

class WeatherForecastService{
    
     getDailyForecastByCityName = async (lat, lon, excludedForecasts) => {

        console.log("som v forecast")
        const coordinates = `{"lat":${lat},"lon":${lon}}`

        const params = {
            coordinates, "excludedForecasts" : excludedForecasts
        }
        console.log("Forecast params: " + JSON.stringify(params))
        console.log(`${WEATHER_FORECAST_API_URL}/daily`)
        var res = (await axios.get(`${WEATHER_FORECAST_API_URL}/daily`, {params}))
        console.log("res service: " + JSON.stringify(res))
        return res

    }
    
}


export default new WeatherForecastService()