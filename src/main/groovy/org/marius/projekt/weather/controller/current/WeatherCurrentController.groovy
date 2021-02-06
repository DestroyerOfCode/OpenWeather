package org.marius.projekt.weather.controller.current

import com.fasterxml.jackson.databind.JsonNode
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.service.current.WeatherService
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
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
import org.springframework.web.client.RestTemplate

@Controller
@CrossOrigin(origins = ["http://localhost:3000"])
@RequestMapping("weather/current")
class WeatherCurrentController {

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
        return new ResponseEntity<WeatherCurrentModel>(weather, HttpStatus.ACCEPTED)
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    def saveWeatherCurrent(@RequestBody JsonNode opts) {
        if (weatherService.saveWeatherCurrent( opts ) )
            return new ResponseEntity<>(HttpStatus.CREATED)
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @RequestMapping(method = RequestMethod.POST, value = ["/retrieve/fromDb", "/retrieve/fromDb/{cityId}"])
    @ResponseBody
    def getWeatherCurrent(@RequestBody(required = false) ArrayList<WeatherCurrentModel> weathers,
                             @RequestParam(required = false) Map<String, Object> opts, @PathVariable(required = false, value = "cityId") String cityId) {
        long startT = System.nanoTime();

        weathers = weatherService.getWeatherCurrentService(opts, weathers, cityId )
//Code you want to measure
        long endT = System.nanoTime();

        long executionTime = (endT - startT);
        writeToFile(executionTime)
        if (weathers)
            return new ResponseEntity<>(weathers, HttpStatus.OK)
        return new ResponseEntity<>(weathers, HttpStatus.NO_CONTENT)
    }

    private static void writeToFile(def executionTime){
        BufferedWriter writer = new BufferedWriter(new FileWriter("file.txt", true));
        writer.append((executionTime/1_000_000).toString() + "\n");
        writer.close()
    }
    @RequestMapping(method = RequestMethod.POST, value = "/save/all")
    @ResponseBody
    def saveAllWeatherCurrentData() {
        def weathers = weatherService.saveAllWeatherCurrentData()
        if ( weathers )
            return new ResponseEntity<ArrayList<WeatherCurrentModel>>(weathers, HttpStatus.CREATED)
        return new ResponseEntity<ArrayList<WeatherCurrentModel>>(weathers, HttpStatus.NO_CONTENT)
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

    @Cacheable(value = "countries")
    @GetMapping("/countries")
    @ResponseBody
    def getDistinctCountries(){
//        Query query = new Query();
//        query.fields().include("sys.country").exclude("_id");
        mongoTemplate.query(WeatherCurrentModel.class).distinct("sys.country").as(String.class).all().
                withIndex().collect{ country, index -> ['name': country, 'id': index]}
    }

    @Cacheable(value = "descriptions")
    @GetMapping("/descriptions")
    @ResponseBody
    def getDistinctDescriptions(){
//        Query query = new Query();
//        query.fields().include("sys.country").exclude("_id");
        mongoTemplate.query(WeatherCurrentModel.class).distinct("weather.description").as(String.class).all().
                withIndex().collect{ country, index -> ['name': country, 'id': index]}
    }
}