package org.marius.projekt.weather.controller.forecast


import groovy.transform.CompileStatic
import org.marius.projekt.weather.model.forecast.WeatherForecastModel
import org.marius.projekt.weather.service.forecast.WeatherForecastService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@CrossOrigin(origins = ["http://localhost:3000", "https://tvoje-pocasie.herokuapp.com"])
@RequestMapping("weather/forecast")
class WeatherForecastController {

    @Autowired WeatherForecastService weatherForecastService

    @Cacheable(value = "daily")
    @CompileStatic
    @RequestMapping(method = RequestMethod.GET, value = "/daily")
    @ResponseBody
    def getDailyForecastByCityName(@RequestParam(required = true) Double lat,
                                   @RequestParam(required = true) Double lon,
                                   @RequestParam(required = false) String excludedForecasts) {
//        https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

        WeatherForecastModel dailyWeatherForecastResult = weatherForecastService
                .getWeatherForecastByCoordinates(lat, lon, excludedForecasts)
        if (dailyWeatherForecastResult)
            return new ResponseEntity<WeatherForecastModel>(dailyWeatherForecastResult, HttpStatus.OK)
        return new ResponseEntity<WeatherForecastModel>(dailyWeatherForecastResult, HttpStatus.NO_CONTENT)

    }
}
