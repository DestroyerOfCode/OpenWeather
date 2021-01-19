package org.marius.projekt.weather.controller.forecast

import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.client.RestTemplate

@Controller
@CrossOrigin(origins = ["http://localhost:3000"])
@RequestMapping("weather/forecast")
class WeatherForecastController {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired RestTemplate restTemplate
    @Autowired OpenWeatherSecurityRepository openWeatherSecurityRepository
    def uriBaseForecast = 'https://api.openweathermap.org/data/2.5/onecall?'

    @RequestMapping(method = RequestMethod.POST, value = "/forecast")
    @ResponseBody
    def getWeatherCurrentBulkFile() {
//        https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        def res = restTemplate.exchange("${uriBaseForecast}lat=49.1364&lon=20.2439&exclude=current,hourly,minutely&appid=${openWeatherSecurityRepository.findAll().first().apiKey}",
                HttpMethod.GET, weatherInternalLogic.setOpenWeatherApiHeaders(), String.class)
        res
    }
}
