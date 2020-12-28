import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, isFilter, isAdditionalFilter, weathers) {
        var filterString = this.buildFilterString(filters)
        if(!weathers)
            weathers = []
        const params = {
            sortBy, isAscending, filterString, isFilter, isAdditionalFilter
        }
            console.log(JSON.stringify(filters))
        return axios.post(`${WEATHER_API_URL}/retrieve/fromDb`, weathers,{params});
    }

    buildFilterString(filters){
        var filterString = ""
        console.log("filters?.length: " + filters?.length)
        for(var i = 0; i <= filters?.length-1; ++i){
            filterString+= JSON.stringify(filters[i]);
            if (filters[i+1])
                filterString += ","
        }
        return filterString
    }
}
export default new WeatherService()
