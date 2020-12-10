import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, filterOperator, isFilter, weathers) {
        var filterString = this.buildFilterString(filters, filterOperator)
        // console.log("filters?.length: " + filters?.length)
    //    console.log(JSON.stringify(filters))
        if(!weathers)
            weathers = []
            // console.log("weathers: " + JSON.stringify(weathers))
        const params = {
            sortBy, isAscending, filterString, isFilter, filterOperator
        }

        // console.log("params: " + JSON.stringify(params) )
        console.log("filters: " + JSON.stringify(filters))
        return axios.post(`${WEATHER_API_URL}/retrieve/fromDb`, weathers,{params});
    }

    buildFilterString(filters, filterOperator){
        var filterString = ""
        for(var i = 0; i <= filters?.length-1; ++i){
            filterString+= JSON.stringify({"filteringNode" : filters[i].filteringNode, "filterOperator" : filters[i].filterOperator});
            if (filters[i+1])
                filterString += ","
            // console.log("filters[i]: " + JSON.stringify(filters[i]))
        }
        return filterString
    }
}
export default new WeatherService()
