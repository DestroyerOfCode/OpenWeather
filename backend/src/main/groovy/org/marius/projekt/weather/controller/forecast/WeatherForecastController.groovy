package org.marius.projekt.weather.controller.forecast


import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiParam
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.forecast.WeatherForecastModel
import org.marius.projekt.weather.service.forecast.WeatherForecastService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@CrossOrigin(origins = ["http://localhost:3000", "https://tvoje-pocasie.herokuapp.com"])
@RequestMapping(value = "weather/forecast",
        produces = MediaType.APPLICATION_JSON_VALUE)
class WeatherForecastController {

    @Autowired WeatherForecastService weatherForecastService

    @ApiOperation(value = "Fetch Forecast weathers",
            notes = "Fetch forecast of weathers by either minutely or daily or hourly",
            httpMethod = "GET")
    @ApiResponses(value = [
        @ApiResponse(code = 500, message = "Uh oh, something went wrong fetching your Forecast weathers"),
        @ApiResponse(code = 200, message = "Successfully Fetched Forecast Weathers", response = WeatherCurrentModel)
    ])
    @Cacheable(value = "daily")
    @CompileStatic
    @RequestMapping(method = RequestMethod.GET, value = "/daily")
    @ResponseBody
    def getDailyForecastByCityName(@ApiParam(value = "latitude") @RequestParam BigDecimal lat,
                                   @ApiParam(value = "longitude") @RequestParam BigDecimal lon,
                                   @ApiParam(value = "Excluded Forecasts", example = "Current, Hourly, Daily")
                                   @RequestParam(required = false) String excludedForecasts) {

        WeatherForecastModel dailyWeatherForecastResult = weatherForecastService
                .getWeatherForecastByCoordinates(lat, lon, excludedForecasts)
        if (dailyWeatherForecastResult)
            return new ResponseEntity<WeatherForecastModel>(dailyWeatherForecastResult, HttpStatus.OK)
        return new ResponseEntity<WeatherForecastModel>(dailyWeatherForecastResult, HttpStatus.NO_CONTENT)

    }
}
