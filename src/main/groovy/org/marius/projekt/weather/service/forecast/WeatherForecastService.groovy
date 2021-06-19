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
    @Autowired ObjectMapper objectMapper;
    def uriBaseForecast = 'https://api.openweathermap.org/data/2.5/onecall?'

    WeatherForecastModel getWeatherForecastByCoordinates(Number lat, Number lon, String excludedForecasts){

        try {
            def uriString = String.format("%slat=%s&lon=%s&exclude=%s&appid=%s", uriBaseForecast,
                    String.format("%.2f", lat),
                    String.format("%.2f", lon),
                    excludedForecasts,
                    System.getenv("OPENWEATHER_API_KEY_ONE")
            )
            if (!System.getenv("OPENWEATHER_API_KEY_ONE"))
                uriString = String.format("%slat=%s&lon=%s&exclude=%s&appid=%s", uriBaseForecast,
                        String.format("%.2f", lat),
                        String.format("%.2f", lon),
                        excludedForecasts,
                        openWeatherSecurityRepository.findAll().first().apiKey
                )
            ResponseEntity<String> weatherDailyJson = restTemplate.exchange( uriString, HttpMethod.GET,
                    weatherInternalLogic.setOpenWeatherApiHeaders(),
                    String.class
            )

            Map<String, Object> weatherDailyMap = (HashMap<String, Object>) new JsonSlurper()
                    .parseText(weatherDailyJson.body.toString())
            weatherInternalLogic.renameKeysStartingWithNumberForecast(weatherDailyMap)

            WeatherForecastModel weatherCurrentModel = objectMapper.convertValue(weatherDailyMap,
                    WeatherForecastModel.class)

            return weatherCurrentModel
        } catch(Exception e){
            e.printStackTrace()
        }
    }
}
