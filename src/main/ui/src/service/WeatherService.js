import axios from 'axios'

const COURSE_API_URL = 'http://localhost:8080'
const WEATHER_API_URL = `${COURSE_API_URL}/weather`

class WeatherService {

    retrieveAllWeathers(sortBy, isAscending, filters, isFilter, weathers) {
        var filterString = this.buildFilterString(filters)
        // console.log("filters?.length: " + filters?.length)
    //    console.log("filters before POST: " + JSON.stringify(filters))
        if(!weathers)
            weathers = []
            // console.log("weathers: " + JSON.stringify(weathers))
        const params = {
            sortBy, isAscending, filterString, isFilter
        }

        // console.log("params: " + JSON.stringify(params) )
        console.log("filters: " + JSON.stringify(filters))
        console.log("filterString: " + filterString)
        console.log("params: " + JSON.stringify(params))

        return axios.post(`${WEATHER_API_URL}/retrieve/fromDb`, weathers,{params});
    }

    buildFilterString(filters){
        var filterString = ""
        console.log("filters?.length: " + filters?.length)
        for(var i = 0; i <= filters?.length-1; ++i){
            console.log("filteringNode : filters[i].filteringNode}): " + JSON.stringify({"filteringNode" : filters[i].filteringNode}))
            filterString+= JSON.stringify({"filteringNode" : filters[i].filteringNode});
            if (filters[i+1])
                filterString += ","
            // console.log("filters[i]: " + JSON.stringify(filters[i]))
        }
        return filterString
    }
}
export default new WeatherService()
