import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, filterOperator) {
        //console.log('executed service')
        console.log("Sort: " +sortBy)
        console.log("filter: " + filters)
        console.log("filterOperator: " + filterOperator)

        const params = {
            sortBy, isAscending, filterOperator

        }
        
        return axios.post(`${WEATHER_API_URL}/retrieve/fromDb`, filters,{params});
    }
}
export default new WeatherService()
