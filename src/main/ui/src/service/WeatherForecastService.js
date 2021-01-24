import axios from 'axios'
const COURSE_API_URL = 'http://localhost:8080'

const WEATHER_FORECAST_API_URL = `${COURSE_API_URL}/weather/foreacast`

function WeatherForecastService(props){

    return 
}
const getDailyForecastByCityName = (lat, lon, excludedWeathers) => {

    console.log("som v forecast")
    const params = {
        lat, lon, excludedWeathers
    }
    return axios.get(`${WEATHER_FORECAST_API_URL}/daily`, params)
}
export default WeatherForecastService