import axios from 'axios'

const COURSE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'

const WEATHER_FORECAST_API_URL = `${COURSE_API_URL}/weather/forecast`

class WeatherForecastService{
    
     getDailyForecastByCityName = async (lat, lon, excludedForecasts) => {

        const coordinates = `{"lat":${lat},"lon":${lon}}`

        const params = {
            coordinates, "excludedForecasts" : excludedForecasts
        }
        var res = (await axios.get(`${WEATHER_FORECAST_API_URL}/daily`, {params}))
        return res

    }
    
}


export default new WeatherForecastService()