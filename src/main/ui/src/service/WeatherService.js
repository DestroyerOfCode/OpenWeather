import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, filterOperator, weathers) {
        var filterString = this.buildFilterString(filters)
        console.log("filters?.length: " + filters?.length)
       
      

        if(!weathers)
            weathers = []
            
        const params = {
            sortBy, isAscending, filterString, filterOperator
        }

        // console.log("params: " + JSON.stringify(params) )
        return axios.post(`${WEATHER_API_URL}/retrieve/fromDb`, weathers,{params});
    }

    buildFilterString(filters){
        var filterString = ""
        for(var i = 0; i <= filters?.length-1; ++i){
            filterString+= JSON.stringify(filters[i]);
            if (filters[i+1])
            filterString += ","
            console.log("filters[i]: " + JSON.stringify(filters[i]))
        }
        return filterString
    }
}
export default new WeatherService()
