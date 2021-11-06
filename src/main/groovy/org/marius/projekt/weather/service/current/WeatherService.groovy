package org.marius.projekt.weather.service.current

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import org.apache.groovy.json.internal.LazyMap
import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import org.bson.Document
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageImpl
import org.springframework.stereotype.Service
import org.springframework.web.client.ResourceAccessException

import java.util.concurrent.CompletableFuture

@Service
class WeatherService {

    @Autowired
    WeatherInternalLogic weatherInternalLogic
    @Autowired
    WeatherCurrentModelRepository weatherCurrentModelRepository
    @Autowired
    ObjectMapper objectMapper

    private static Logger logger = LogManager.getLogger(WeatherService.class);

    WeatherCurrentModel findWeather(Map<String, Object> opts) {

        Object weatherMap = (LazyMap) weatherInternalLogic.parseWeatherEntityToJson(weatherInternalLogic.setOpenWeatherApiHeaders(), opts)

        ArrayList<Document> countryNames = weatherInternalLogic.getCountryNames(weatherMap)

        weatherMap.sys << ["countryName": countryNames.first().sys.countryName]

        weatherInternalLogic.renameKeysStartingWithNumber(weatherMap)

        WeatherCurrentModel weatherCurrentModel = objectMapper.convertValue(weatherMap, WeatherCurrentModel.class)
        return weatherCurrentModel
    }

    Integer findTemperature(Map<String, Object> opts) {
        findWeather(opts).getAt('main').temp
    }

    ArrayList findCityIds() {
        BufferedReader idStream = new BufferedReader(
                new InputStreamReader(
                        new FileInputStream('src/main/resources/SlovakCitiesList.json'), 'UTF-8')
        )
        new JsonSlurper().parse(idStream) as ArrayList ?: null

    }

    def saveWeatherCurrent(weatherCurrent) {
        return weatherCurrentModelRepository.save(weatherCurrent)
    }

    String saveAllWeatherCurrentData() {
        CompletableFuture.runAsync({ ->
            def cityIds = findCityIds()

            cityIds.eachWithIndex {
                cityId, index ->
                    WeatherCurrentModel weather = new WeatherCurrentModel()
                    try {

                        // this is to not overpass the minute limit for FREE API calls
                        if (index != 0 && index % 40 == 0) {
                            logger.info("sleeping")
                            sleep(65_000L)
                        }

                        weather = findWeather(['cityId': cityId.id])
                        saveWeatherCurrent(weather)
                        logger.info("saved ${weather.name}")
                    } catch (RuntimeException ex) {
                        logger.error("Error saving weather ${weather.name}", ex)
                    }
            }
            logger.info("Finished saving current weathers")
        })
        return "OK"
    }

    PageImpl<WeatherCurrentModel> getWeatherCurrentService(Map<String, Object> opts) {
        return weatherInternalLogic.getCurrentWeather(opts)
    }


}