package org.marius.projekt.forecast.controller

import com.fasterxml.jackson.databind.JsonNode
import groovy.json.JsonSlurper
import org.marius.projekt.forecast.model.WeatherModel
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.marius.projekt.forecast.service.WeatherService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@CrossOrigin(origins = ["http://localhost:3000"])
@RequestMapping("weather")
class WeatherController {

    @Autowired WeatherService weatherService
    @Autowired MongoTemplate mongoTemplate

    /***
     * example curls
     *  curl -d 'cityName={name}' -X POST http://localhost:8080/weather
     *  curl -d 'cityName={name}&state={state}' -X POST http://localhost:8080/weather
     *  curl -d 'cityId={id}' -X POST http://localhost:8080/weather
     * @param opts
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    def getWeatherData(@RequestParam Map<String, Object> opts) {
        def weather = weatherService.findWeather( opts )
        if (!weather)
            return new ResponseEntity<>(HttpStatus.NO_CONTENT)
        return new ResponseEntity<WeatherModel>(weather, HttpStatus.ACCEPTED)
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    def saveWeatherData(@RequestBody JsonNode opts) {
        if (weatherService.saveWeatherData( opts ) )
            return new ResponseEntity<>(HttpStatus.CREATED)
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @RequestMapping(method = RequestMethod.POST, value = ["/retrieve/fromDb", "/retrieve/fromDb/{cityId}"])
    @ResponseBody
    def getWeatherDataFromDb( @RequestBody(required = false) ArrayList<WeatherModel> weathers,
                              @RequestParam(required = false) Map<String, Object> opts, @PathVariable(required = false, value = "cityId") String cityId) {

        weathers = weatherService.getWeatherDataFromDbService(opts, weathers, cityId )
        if (weathers)
            return new ResponseEntity<>(weathers, HttpStatus.OK)
        return new ResponseEntity<>(weathers, HttpStatus.NO_CONTENT)
    }

    @RequestMapping(method = RequestMethod.POST, value = "/save/all")
    @ResponseBody
    def saveAllWeatherData() {
        def weathers = weatherService.saveAllWeatherData()
        if ( weathers )
            return new ResponseEntity<ArrayList<WeatherModel>>(weathers, HttpStatus.CREATED)
        return new ResponseEntity<ArrayList<WeatherModel>>(weathers, HttpStatus.NO_CONTENT)
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

    @GetMapping("/countries")
    @ResponseBody
    def getCountries(){
//        Query query = new Query();
//        query.fields().include("sys.country").exclude("_id");
        mongoTemplate.query(WeatherModel.class).distinct("sys.country").as(String.class).all().
                withIndex().collect{ country, index -> ['name': country, 'id': index]}
    }
}
