package org.marius.projekt.weather.service.current

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import org.apache.groovy.json.internal.LazyMap
import org.bson.Document
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageImpl
import org.springframework.stereotype.Service
import org.springframework.web.client.ResourceAccessException

@Service
class WeatherService {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired WeatherCurrentModelRepository weatherCurrentModelRepository
    @Autowired ObjectMapper objectMapper

    WeatherCurrentModel findWeather(Map<String, Object> opts ){

        Object weatherMap = (LazyMap) weatherInternalLogic.parseWeatherEntityToJson(weatherInternalLogic.setOpenWeatherApiHeaders(),opts)

        ArrayList<Document> countryNames = weatherInternalLogic.getCountryNames(weatherMap)

        weatherMap.sys << ["countryName" : countryNames.first().sys.countryName]

        weatherInternalLogic.renameKeysStartingWithNumber(weatherMap)

        WeatherCurrentModel weatherCurrentModel = mapper.convertValue(weatherMap, WeatherCurrentModel.class)
        return weatherCurrentModel
    }

    Integer findTemperature( Map<String, Object> opts){
        findWeather(opts).getAt('main').temp
    }

    ArrayList findCityIds(){
        BufferedReader idStream = new BufferedReader(
                new InputStreamReader(
                        new FileInputStream('src/main/resources/SlovakCitiesList.json'), 'UTF-8')
        )
        new JsonSlurper().parse(idStream) as ArrayList ?: null

    }

    def saveWeatherCurrent( def opts ){
        WeatherCurrentModel weatherCurrentModel
        if (opts instanceof ObjectNode ) {
            weatherCurrentModel = objectMapper.convertValue(opts, WeatherCurrentModel.class)
        }
        else
            weatherCurrentModel = opts
        return weatherCurrentModelRepository.save( weatherCurrentModel )
    }

    ArrayList<WeatherCurrentModel> saveAllWeatherCurrentData(){
        def cityIds = findCityIds()
        ArrayList<WeatherCurrentModel> weathers = new ArrayList<WeatherCurrentModel>()
        cityIds.eachWithIndex{
            cityId, index ->
                try {

                    // this is to not overpass the minute limit for FREE API calls
                        if (index != 0 && index % 40 == 0)
                        sleep(65_000L)
                    weathers.add(findWeather(['cityId': cityId.id]))
                    saveWeatherCurrent(weathers[index])
                } catch(ResourceAccessException | RuntimeException ex){
                  System.out.println(ex)
                }
        }
        weathers
    }

    PageImpl<WeatherCurrentModel> getWeatherCurrentService(Map<String, Object> opts){
        return weatherInternalLogic.getCurrentWeather(opts)
    }



}