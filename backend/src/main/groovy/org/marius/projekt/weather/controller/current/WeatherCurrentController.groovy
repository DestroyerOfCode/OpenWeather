package org.marius.projekt.weather.controller.current

import com.fasterxml.jackson.databind.JsonNode
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.bson.BsonDocument
import org.bson.Document
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.service.current.WeatherService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.PageImpl
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.scheduling.annotation.Scheduled
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
@CrossOrigin(origins = ["http://localhost:3000", "https://tvoje-pocasie.herokuapp.com"])
@RequestMapping(value = "weather/current",
        produces = MediaType.APPLICATION_JSON_VALUE)
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

    @ApiOperation(value = "Fetch current weathers",
        notes = "Fetches at the moment all Weather from Slovakia and can sort, paginate and filter them",
        httpMethod = "POST")
    @ApiResponses(value = [
        @ApiResponse(code = 500, message = "Uh oh, something went wrong fetching your weathers"),
        @ApiResponse(code = 200, message = "Successfully fetched weathers", response = WeatherCurrentModel,
            responseContainer = "List")
    ])
    @Cacheable(value = "currentWeathers")
    @RequestMapping(method = RequestMethod.POST, value = "/retrieve/fromDb")
    @ResponseBody
    def getWeatherCurrent(@RequestBody(required = false) Map<String, Object> opts) {
        PageImpl<WeatherCurrentModel> weathers = weatherService.getWeatherCurrentService(opts)
        if (weathers)
            return new ResponseEntity<>(weathers, HttpStatus.OK)
        return new ResponseEntity<>(weathers, HttpStatus.NO_CONTENT)
    }

    @RequestMapping(method = RequestMethod.GET, value = "/test")
    def getTest(){
        return 0;
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
    @GetMapping(value = "/descriptions")
    @ResponseBody
    def getDistinctDescriptions(){
        mongoTemplate.query(WeatherCurrentModel.class).distinct("weather.description").as(String.class).all().
                withIndex().collect{ description, index -> ['name': description, 'id': index, 'originalValue': description]}
    }

    private static void writeToFile(def executionTime){
        BufferedWriter writer = new BufferedWriter(new FileWriter("file.txt", true));
        writer.append((executionTime/1_000_000).toString() + "\n");
        writer.close()
    }
}
