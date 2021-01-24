package org.marius.projekt.weather.controller.forecast

import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.forecast.WeatherForecastModel
import org.marius.projekt.weather.service.forecast.WeatherForecastService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.client.RestTemplate

@Controller
@CrossOrigin(origins = ["http://localhost:3000"])
@RequestMapping("weather/forecast")
class WeatherForecastController {

    @Autowired WeatherForecastService weatherForecastService

    @CompileStatic
    @RequestMapping(method = RequestMethod.GET, value = "/daily")
    @ResponseBody
    def getDailyForecastByCityName(@RequestParam(required = true) String coordinates, @RequestParam(required = false) String excludedForecasts) {
//        https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        HashMap<String, Number> coordinatesMap = (HashMap<String, Number>) new JsonSlurper().parseText(coordinates)

        WeatherForecastModel dailyWeatherForecastResult = weatherForecastService.getWeatherForecastByCoordinates(coordinatesMap.lat, coordinatesMap.lon, excludedForecasts)
        if (dailyWeatherForecastResult)
            return new ResponseEntity<WeatherForecastModel>(dailyWeatherForecastResult, HttpStatus.OK)
        return new ResponseEntity<WeatherForecastModel>(dailyWeatherForecastResult, HttpStatus.NO_CONTENT)

    }
}
