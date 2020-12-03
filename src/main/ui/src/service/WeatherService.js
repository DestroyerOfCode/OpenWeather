import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending) {
        //console.log('executed service')
        console.log(sortBy)
        return axios.get(`${WEATHER_API_URL}/retrieve/fromDb`, {params: {
            sortBy, isAscending
        }});
    }
}
export default new WeatherService()
