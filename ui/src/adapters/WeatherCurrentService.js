import axios from 'axios'

const COURSE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'
const WEATHER_CURRENT_API_URL = `${COURSE_API_URL}/weather/current`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, currentPage, itemsPerPage,) {
        return axios.post(`${WEATHER_CURRENT_API_URL}/retrieve/fromDb`, {
            'sortBy': sortBy,
            'isAscending': isAscending,
            'filters': filters,
            'itemsPerPage': itemsPerPage,
            'pageNumber': currentPage
        });
    }

    retrieveAllCountries = async  () => await  axios.get(`${WEATHER_CURRENT_API_URL}/countries`)
    retrieveAllDescriptions = async () => await axios.get(`${WEATHER_CURRENT_API_URL}/descriptions`)


}
export default new WeatherService()
