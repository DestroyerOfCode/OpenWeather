import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

<<<<<<< Updated upstream
    retrieveAllWeathers(sortBy, isAscending, filters, filterOperator) {
        //console.log('executed service')
        console.log("Sort: " +sortBy)
        console.log("filter: " + filters)
        console.log("filterOperator: " + filterOperator)

        const params = {
            sortBy, isAscending, filterOperator

        }
        
        return axios.post(`${WEATHER_API_URL}/retrieve/fromDb`, filters,{params});
=======
<<<<<<< Updated upstream
    retrieveAllWeathers() {
        //console.log('executed service')
        return axios.get(`${WEATHER_API_URL}/retrieve/fromDb`);
=======
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    }
}
export default new WeatherService()
