package org.marius.projekt.weather.service.forecast

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.json.JsonSlurper
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.marius.projekt.weather.model.forecast.WeatherForecastModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class WeatherForecastService {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired RestTemplate restTemplate
    @Autowired OpenWeatherSecurityRepository openWeatherSecurityRepository
    def uriBaseForecast = 'https://api.openweathermap.org/data/2.5/onecall?'

//    @CompileStatic
    WeatherForecastModel getWeatherForecastByCoordinates(Number lat, Number lon, String excludedForecasts){

        try {
            def uriString = "${uriBaseForecast}lat=${lat}&lon=${lon}&exclude=${excludedForecasts}&appid=${System.getenv("OPENWEATHER_API_KEY_ONE")}"
            if (!System.getenv("OPENWEATHER_API_KEY_ONE"))
                uriString = "${uriBaseForecast}lat=${lat}&lon=${lon}&exclude=${excludedForecasts}&appid=${openWeatherSecurityRepository.findAll().first().apiKey}"
            ResponseEntity<String> weatherDailyJson = restTemplate.exchange(uriString, HttpMethod.GET, weatherInternalLogic.setOpenWeatherApiHeaders(), String.class)

            Map<String, Object> weatherDailyMap = (HashMap<String, Object>) new JsonSlurper().parseText(weatherDailyJson.body.toString())
            weatherDailyMap.hourly.findAll{ it.rain}.collect {
                it.rain << ["_1h": it.rain."1h"]
                it.rain.remove("1h")
            }

            weatherDailyMap.hourly.findAll{ it.snow}.collect {
                it.snow << ["_1h": it.snow."1h"]
                it.snow.remove("1h")
            }

            WeatherForecastModel weatherCurrentModel = new ObjectMapper().convertValue(weatherDailyMap, WeatherForecastModel.class)
            return weatherCurrentModel
        } catch(Exception e){
            e.printStackTrace()
        }
    }
}
