package org.marius.projekt.forecast.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import org.apache.groovy.json.internal.LazyMap
import org.marius.projekt.forecast.businessLogic.WeatherInternalLogic
import org.marius.projekt.forecast.model.WeatherModel
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class WeatherService {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired WeatherModelRepository weatherModelRepository

    WeatherModel findWeather( Map<String, Object> opts ){

        Object weatherMap = (LazyMap) weatherInternalLogic.parseWeatherEntityToJson(weatherInternalLogic.setHeaders(),opts)
        ObjectMapper mapper = new ObjectMapper()

//       I already have a Main class and the beans were intersecting each other so i named it weatherMain
        Object o = weatherMap.remove('main')
        weatherMap.put('weatherMain', o)

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
        return weatherModel as WeatherModel
    }

    Integer findTemperature( Map<String, Object> opts){
        findWeather(opts).getAt('main').temp
    }

    ArrayList findCityIds(){
        BufferedReader idStream = new BufferedReader(new InputStreamReader(new FileInputStream('src/main/resources/cityList.json'), 'UTF-8'))
        new JsonSlurper().parse(idStream) as ArrayList ?: null

    }

    def insertWeatherData( def opts ){
        WeatherModel weatherMap
        if (opts instanceof ObjectNode ) {
            ObjectMapper objectMapper = new ObjectMapper()
            weatherMap = objectMapper.convertValue(opts, WeatherModel.class)
        }
        else
            weatherMap = opts
        return weatherModelRepository.insert( weatherMap )
    }

    def insertAllWeatherData(){
        def cityIds = findCityIds()
        cityIds.forEach{
            cityId ->
                def weatherMap = findWeather(['cityId' : cityId.id])
                insertWeatherData( weatherMap )
        }
        return new ResponseEntity<>(HttpStatus.CREATED)
    }
}
