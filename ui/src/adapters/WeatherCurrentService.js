import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_CURRENT_API_URL = `${COURSE_API_URL}/weather/current`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, isFilter, isAdditionalFilter, weathers) {
        console.log("filters: ")
        console.log(filters)
        var filterString = this.buildFilterString(filters)
        if(!weathers)
            weathers = []
        const params = {
            sortBy, isAscending, filterString, isFilter, isAdditionalFilter
        }
        return axios.post(`${WEATHER_CURRENT_API_URL}/retrieve/fromDb`, weathers,{params});
    }

    buildFilterString(filters){
        var filterString = ""
        for(var i = 0; i <= filters?.length-1; ++i){
            filterString+= JSON.stringify(filters[i]);
            if (filters[i+1])
                filterString += ","
        }
        return filterString
    }

    retrieveAllCountries =async  () => await  axios.get(`${WEATHER_CURRENT_API_URL}/countries`)
    retrieveAllDescriptions = async () => await axios.get(`${WEATHER_CURRENT_API_URL}/descriptions`)


}
export default new WeatherService()
