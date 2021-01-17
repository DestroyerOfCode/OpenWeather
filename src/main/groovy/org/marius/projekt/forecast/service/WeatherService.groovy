package org.marius.projekt.forecast.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import org.apache.groovy.json.internal.LazyMap
import org.bson.Document
import org.marius.projekt.forecast.businessLogic.FilterOperatorOverload
import org.marius.projekt.forecast.businessLogic.WeatherInternalLogic
import org.marius.projekt.forecast.model.WeatherModel
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.cache.Cache;

@Service

class WeatherService {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired WeatherModelRepository weatherModelRepository
    @Autowired FilterOperatorOverload filterOperatorOverload
    @Autowired MongoTemplate mongoTemplate

    WeatherModel findWeather( Map<String, Object> opts ){

        Object weatherMap = (LazyMap) weatherInternalLogic.parseWeatherEntityToJson(weatherInternalLogic.setHeaders(),opts)
        ObjectMapper mapper = new ObjectMapper()

//       I already have a Main class and the beans were intersecting each other so i named it weatherMain
        Object o = weatherMap.remove('main')
        weatherMap.put('weatherMain', o)

        // in the jsonnode I receive there are keys starting with a numeral so I have to change it to start with literal
        if ( weatherMap.containsKey('rain')) {
            o = weatherMap.rain.remove('1h')
            weatherMap.rain.put('oneh', o)
            o = weatherMap.rain.remove('3h')
            weatherMap.rain.put('threeh', o)
        }

        if ( weatherMap.containsKey('snow')) {
            o = weatherMap.snow.remove('1h')
            weatherMap.snow.put('oneh', o)
            o = weatherMap.snow.remove('3h')
            weatherMap.snow.put('threeh', o)
        }

        WeatherModel weatherModel = mapper.convertValue(weatherMap, WeatherModel.class)
        return weatherModel
    }

    Integer findTemperature( Map<String, Object> opts){
        findWeather(opts).getAt('main').temp
    }

    ArrayList findCityIds(){
        BufferedReader idStream = new BufferedReader(new InputStreamReader(new FileInputStream('src/main/resources/current.json'), 'UTF-8'))
        new JsonSlurper().parse(idStream) as ArrayList ?: null

    }

    def saveWeatherData( def opts ){
        WeatherModel weatherModel
        if (opts instanceof ObjectNode ) {
            ObjectMapper objectMapper = new ObjectMapper()
            weatherModel = objectMapper.convertValue(opts, WeatherModel.class)
        }
        else
            weatherModel = opts
        return weatherModelRepository.save( weatherModel )
    }

//    @CompileStatic
    ArrayList<WeatherModel> saveAllWeatherData(){
        def cityIds = findCityIds()
        ArrayList<WeatherModel> weathers = new ArrayList<WeatherModel>()
        cityIds.eachWithIndex{
            cityId, index ->
                weathers.add(findWeather(['cityId' : cityId.id]))
                saveWeatherData( weathers[index] )
        }
        weathers
    }

    def buildAggregationQuery(def filterList){

        def weatherModelCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(WeatherModel.class));

        weatherModelCollection.aggregate([
                new Document([$match : [
                        $and : [

                        ] << buildFilters.call(filterList)
                ]]),
                new Document([$project : [
                        "creationDate" : 0
                ]]),
        ]) as List

    }

    //It must be changed to a Number otherwise I would be comparing strings and it works improperly wit decimal because it takes length of string into account
    def isStringNumber = { filterValue, filterOperator -> filterValue instanceof String && filterValue.isNumber() && filterOperator != "eq"  }

    def buildFilters = { filterList ->

        def filterMap = [:]
        filterList.each {

            item ->
                (LinkedHashMap) item.each {
                    filter, filterOperatorAndValue ->
                        filterOperatorAndValue.collect {
                            filterOperator, filterValue ->
                                //this if is here because some nodes are the same and I only need to append a new filter operator (like Gte and lte)
                                if (filterMap[filter]) filterMap[filter] << [("\$" + filterOperator) : ( isStringNumber.call(filterValue, filterOperator) ? new BigDecimal(filterValue) : filterValue )]
                                else filterMap << [(filter): [("\$" + filterOperator) : ( isStringNumber.call(filterValue, filterOperator) ? new BigDecimal(filterValue) : filterValue )]]
                        }.first()
                }
        }
        filterMap
    }
//    @CompileStatic
    @Cacheable(value = "weathers")
    ArrayList<WeatherModel> getWeatherDataFromDbService(Map<String, Object> opts, ArrayList<WeatherModel> weathers, String cityId ){

        if (cityId) {
            weathers << weatherModelRepository.findById(cityId)
            return weathers
        }

        if (!weathers && !new Boolean((String) opts.isFilter))
            weathers = (ArrayList<WeatherModel>) weatherModelRepository.findAll()

        if (opts.sortBy && opts.isAscending) {
            String sortString = opts.sortBy
            String[] path = sortString.split(/\./)
            if (!weathers) weatherModelRepository.findAll()
            weathers = (ArrayList<WeatherModel>) weathers.sort() {
                Object a, Object b ->
                    a = buildCompareParam(a, path)
                    b = buildCompareParam(b, path)
                    new Boolean((String) opts.isAscending) ? a <=> b : b <=> a
            }
        }

        //example query params "{\"lat\":{\"gte\": \"55.32\", \"lte\" : \"70.02\"}}, {\"country\":{\"in\":\"IQ,GB,AE\"}}"

        if (new Boolean((String) opts.isFilter) && !opts.sortBy) {
            ArrayList<LinkedHashMap<String, LinkedHashMap<String, String>>> filterList = (ArrayList<LinkedHashMap<String, LinkedHashMap<String, String>>>) new JsonSlurper().parseText("[" + opts.filterString + "]")

            // I need index because I cant get map element of array without one
            // I need to change it from string to array of strings because in query parameters of URI it
            // is impossible to send arrays and I am sending it as string in format 'in=AO, AE, RU'
            // in cases where multiple filters containing multiple values I must get indices of all those filters
            // to change the filter values from strings to array
            ArrayList<Integer> indicesOfArrayFilters =  new ArrayList()
            weatherInternalLogic.findIndicesOfArrayFilters(indicesOfArrayFilters, filterList)
            
            if (!new Boolean((String) opts.isAdditionalFilter))
                weathers = buildAggregationQuery(filterList)
            else {
                filterList.forEach { filterItem ->

                    String filterName = filterItem.entrySet().stream().findFirst().get().getKey()
                    LinkedHashMap<String, String> filterOperatorsMap = (LinkedHashMap<String, String>) filterItem.entrySet().stream().findFirst().get().getValue()

                    if (filterName) {
                        filterOperatorsMap.forEach { filterOperator, filterValue ->
                            String[] path = filterName.split(/\./)
                            weathers = (ArrayList<WeatherModel>) weathers.findAll { it ->
                                def OverloadedFilterOperator = getCorrectFilterOperator(filterOperator)
                                filterOperatorOverload."${OverloadedFilterOperator}"(buildCompareParam(it.asMap(), path), filterValue)
                            }
                        }
                    }
                }
            }
        }
        weathers
    }

    def getCorrectFilterOperator( filterOperator) {
        filterOperator == 'in' ? 'contains' : filterOperator
    }

    @CompileStatic
    static Object buildCompareParam(Object paramToChange, String[] path){
        paramToChange = path.inject(paramToChange){ weather, String p -> weather?.getAt(p) }
        if (paramToChange instanceof String && paramToChange.isNumber()) return new BigDecimal(paramToChange)
        else if (paramToChange instanceof Collection) return paramToChange.join(', ')
        return paramToChange
    }
}