import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, filterOperator, weathers) {
        //console.log('executed service')
        console.log("Sort: " +sortBy)
        console.log("filter: " + JSON.stringify(filters))
        console.log("filterOperator: " + filterOperator)
        console.log("weathers: " + weathers)

        if(filters)
            filters = JSON.stringify(filters)
        const params = {
            sortBy, isAscending, filters, filterOperator

        }
        console.log("params: " + JSON.stringify(params) )
        return axios.post(`${WEATHER_API_URL}/retrieve/fromDb`, weathers,{params});
    }
}
export default new WeatherService()
