package org.marius.projekt.weather.controller.current

import com.fasterxml.jackson.databind.JsonNode
import org.bson.BsonDocument
import org.bson.Document
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.service.current.WeatherService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.PageImpl
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@CrossOrigin(origins = ["http://localhost:3000", "https://tvoje-pocasie.herokuapp.com"])
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

    @RequestMapping(method = RequestMethod.POST, value = ["/retrieve/fromDb"])
    @ResponseBody
    def getWeatherCurrent(@RequestBody(required = false) Map<String, Object> opts) {
        PageImpl<WeatherCurrentModel> weathers = weatherService.getWeatherCurrentService(opts)
        if (weathers)
            return new ResponseEntity<>(weathers, HttpStatus.OK)
        return new ResponseEntity<>(weathers, HttpStatus.NO_CONTENT)
    }

    @RequestMapping(method = RequestMethod.POST, value = "/save/all")
    @Scheduled(cron = "* 0 * * * ?")
    @ResponseBody
    def saveAllWeatherCurrentData() {
        weatherService.saveAllWeatherCurrentData()
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
        def weatherCurrentModelCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(WeatherCurrentModel.class));
        weatherCurrentModelCollection.aggregate([
                new Document([
                    "\$group": [
                        "_id": "\$sys.country", "countryName": ["\$first" : "\$sys.countryName"]
                    ]
                ]),
                new Document([
                        "\$addFields": [
                            "countryCode": "\$_id", "_id": null, "originalCountryName": "\$countryName"
                        ]
                ]),
                BsonDocument.parse('''
                {
                    "\$sort": {"countryName" : 1}
                }
                ''')

        ]) as List
    }

    //originalValue is here because Of translations. Need the original english value
    @Cacheable(value = "descriptions")
    @GetMapping("/descriptions")
    @ResponseBody
    def getDistinctDescriptions(){
        mongoTemplate.query(WeatherCurrentModel.class).distinct("weather.description").as(String.class).all().
                withIndex().collect{ description, index -> ['name': description, 'id': index, 'originalValue': description]}
    }

    //heroku disables server after 30 mins of inactivity
    //this is to prevent it from happening
    @Scheduled(cron = "* */20 * * * ?")
    @GetMapping("/ping")
    @ResponseBody
    def pingServer(){
        println("pinging server wee")
    }

    private static void writeToFile(def executionTime){
        BufferedWriter writer = new BufferedWriter(new FileWriter("file.txt", true));
        writer.append((executionTime/1_000_000).toString() + "\n");
        writer.close()
    }
}
