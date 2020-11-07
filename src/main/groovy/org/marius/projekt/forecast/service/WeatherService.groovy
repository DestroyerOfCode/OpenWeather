package org.marius.projekt.forecast.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.json.JsonSlurper
import org.apache.groovy.json.internal.LazyMap
import org.marius.projekt.forecast.businessLogic.WeatherInternalLogic
import org.marius.projekt.forecast.model.WeatherModel
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.springframework.beans.factory.annotation.Autowired
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

        WeatherModel weatherModel = mapper.convertValue(weatherMap, WeatherModel.class)
        return weatherModel as WeatherModel
    }

    Integer findTemperature( Map<String, Object> opts){
        findWeather(opts).getAt('main').temp
    }

    ArrayList findCityIds(){
        BufferedReader idStream = new BufferedReader(new InputStreamReader(new FileInputStream('src/main/resources/current.json'), 'UTF-8'))
        new JsonSlurper().parse(idStream) as ArrayList ?: null

    }

    def insertWeatherData( JsonNode opts ){
        ObjectMapper objectMapper = new ObjectMapper()
        WeatherModel weatherMap =  objectMapper.convertValue(opts, WeatherModel.class)
        return weatherModelRepository.insert( weatherMap )
    }
}
