package org.marius.projekt.forecast.controller

import org.marius.projekt.forecast.service.WeatherService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

import java.lang.reflect.Array

@Controller("/")
class WeatherController {

    @Autowired WeatherService weatherService

    /***
     * example curls
     *  curl -d 'cityName={name}' -X POST http://localhost:8080
     *  curl -d 'cityName={name}&state={state}' -X POST http://localhost:8080
     *  curl -d 'cityId={id}' -X POST http://localhost:8080
     * @param opts
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    def getWeatherData(@RequestParam Map<String, Object> opts) {
        def weather = weatherService.findWeather( opts )
        if (!weather)
            return new ResponseEntity<>(HttpStatus.NO_CONTENT)
        return weather
    }

    @PostMapping("/all")
    @ResponseBody
    ArrayList getAllWeatherData(@RequestParam Map<String, Object> opts){
        ArrayList cityIds = weatherService.findCityIds()

        ArrayList temperaturesInCities = new ArrayList()
        cityIds.each { it ->
            opts.cityId = it.id
            temperaturesInCities.add(weatherService.findTemperature(opts))
        }
        temperaturesInCities
    }

}
