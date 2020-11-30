import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers() {
        //console.log('executed service')
        return axios.get(`${WEATHER_API_URL}/retrieve/fromDb`);
    }
}
export default new WeatherService()
