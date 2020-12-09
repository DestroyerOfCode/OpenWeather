package org.marius.projekt.forecast.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import org.apache.groovy.json.internal.LazyMap
import org.marius.projekt.forecast.businessLogic.FilterOperatorOverload
import org.marius.projekt.forecast.businessLogic.WeatherInternalLogic
import org.marius.projekt.forecast.model.WeatherModel
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class WeatherService {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired WeatherModelRepository weatherModelRepository
    @Autowired FilterOperatorOverload filterOperatorOverload

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
        BufferedReader idStream = new BufferedReader(new InputStreamReader(new FileInputStream('src/main/resources/cityList.json'), 'UTF-8'))
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

    def saveAllWeatherData(){
        def cityIds = findCityIds()
        cityIds.forEach{
            cityId ->
                def weatherMap = findWeather(['cityId' : cityId.id])
                saveWeatherData( weatherMap )
        }
        return new ResponseEntity<>(HttpStatus.CREATED)
    }

    def getWeatherDataFromDbService(Map<String, Object> opts, ArrayList<WeatherModel> weathers, String cityId ){

        if (cityId) {
            weathers << weatherModelRepository.findById(cityId)
            return weathers
        }

        if (!weathers)
            weathers = weatherModelRepository.findAll()

        if (opts.sortBy && opts.isAscending) {
            def path = opts.sortBy.split(/\./)
            weathers = weathers.sort() {
                a, b ->
                    a = buildCompareParam(a, path)
                    b = buildCompareParam(b, path)
                    new Boolean(opts.isAscending) ? a <=> b : b <=> a
            }
        }

        if (new Boolean(opts.isFilter)) {
            def newArr= new JsonSlurper().parseText("["+opts.filterString+"]")
            weathers = weatherModelRepository.findAll()

//            opts.filters = new JsonSlurper().parseText(opts.filters)
            newArr.forEach { item ->
                item.forEach { mapKey, mapVal ->
                    if (mapVal)
                        weathers = weathers.findAll { it ->
                            filterOperatorOverload."${opts.filterOperator}"(weatherInternalLogic.findNestedKey(it.asMap(), mapKey), mapVal)
                        }
                }
            }
        }

        weathers
    }

    def static buildCompareParam(def paramToChange, def path){
        paramToChange = path.inject(paramToChange){ weather, p -> weather?.getAt(p) }
        if (paramToChange instanceof String && paramToChange.isNumber()) return new BigDecimal(paramToChange)
        return paramToChange
    }
}
