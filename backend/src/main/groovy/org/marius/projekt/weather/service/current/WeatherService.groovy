package org.marius.projekt.weather.service.current
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import org.apache.groovy.json.internal.LazyMap
import org.bson.BsonDocument
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.client.ResourceAccessException;

@EnableScheduling
@Service
class WeatherService {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired WeatherCurrentModelRepository weatherCurrentModelRepository
    @Autowired MongoTemplate mongoTemplate

    WeatherCurrentModel findWeather(Map<String, Object> opts ){

        Object weatherMap = (LazyMap) weatherInternalLogic.parseWeatherEntityToJson(weatherInternalLogic.setOpenWeatherApiHeaders(),opts)
        def weatherCurrentModelCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(WeatherCurrentModel.class));

        ObjectMapper mapper = new ObjectMapper()

        //noinspection GroovyAssignabilityCheck
        def countryNamesArr = weatherCurrentModelCollection.aggregate([BsonDocument.parse('''
            {
                "\$match": {
                    "sys.country":"'''+weatherMap.sys.country+'''"
                }
            },
            {
                "\$lookup": {
                    "from": "countries",
                    "localField": "sys.country",
                    "foreignField": "code",
                    "as": "countries"
                }
            },
            {
                "\$project": {
                    "countries.name": 1
                }
            }
        ''')]) as List

        weatherMap.sys << ["countryName" : countryNamesArr.first().sys.countryName]
//       I already have a Main class and the beans were intersecting each other so i named it weatherMain
        Object o = weatherMap.remove('main')
        weatherMap.put('weatherMain', o)
        o = weatherMap.remove('id')
        weatherMap.put('_id', o)

        // in the jsonnode I receive there are keys starting with a numeral so I have to change it to start with literal
        if ( weatherMap.containsKey('rain')) {
            o = weatherMap.rain.remove('1h')
            weatherMap.rain.put('oneh', o)
            o = weatherMap.rain.remove('3h')
            weatherMap.rain.put('threeh', o)
        }

        if ( weatherMap.containsKey('snow')) {
            o = weatherMap.snow.remove('1h')
            weatherMap.snow.put('oneh', o)
            o = weatherMap.snow.remove('3h')
            weatherMap.snow.put('threeh', o)
        }

        weatherMap.coord.lat = new Double(weatherMap.coord.lat)
        weatherMap.coord.lon = new Double(weatherMap.coord.lon)
        weatherMap.weatherMain.temp = new Double(weatherMap.weatherMain.temp)
        weatherMap.weatherMain.feels_like = new Double(weatherMap.weatherMain.feels_like)
        weatherMap.weatherMain.temp_max = new Double(weatherMap.weatherMain.temp_max)
        weatherMap.weatherMain.temp_min = new Double(weatherMap.weatherMain.temp_min)

        WeatherCurrentModel weatherCurrentModel = mapper.convertValue(weatherMap, WeatherCurrentModel.class)
        return weatherCurrentModel
    }

    Integer findTemperature( Map<String, Object> opts){
        findWeather(opts).getAt('main').temp
    }

    ArrayList findCityIds(){
        BufferedReader idStream = new BufferedReader(new InputStreamReader(new FileInputStream('src/main/resources/SlovakCitiesList.json'), 'UTF-8'))
        new JsonSlurper().parse(idStream) as ArrayList ?: null

    }

    def saveWeatherCurrent( def opts ){
        WeatherCurrentModel weatherCurrentModel
        if (opts instanceof ObjectNode ) {
            ObjectMapper objectMapper = new ObjectMapper()
            weatherCurrentModel = objectMapper.convertValue(opts, WeatherCurrentModel.class)
        }
        else
            weatherCurrentModel = opts
        return weatherCurrentModelRepository.save( weatherCurrentModel )
    }

//    @CompileStatic
    @Scheduled(cron = "* 0 * * * ?")
    ArrayList<WeatherCurrentModel> saveAllWeatherCurrentData(){
        def cityIds = findCityIds()
        ArrayList<WeatherCurrentModel> weathers = new ArrayList<WeatherCurrentModel>()
        cityIds.eachWithIndex{
            cityId, index ->
                try {

                    // this is to not overpass the minute limit for FREE API calls
                        if (index != 0 && index % 40 == 0)
                        sleep(65_000L)
                    weathers.add(findWeather(['cityId': cityId.id]))
                    saveWeatherCurrent(weathers[index])
                } catch(ResourceAccessException | RuntimeException ex){
                  System.out.println(ex)
                }
        }
        weathers
    }


//    @CompileStatic
    @Cacheable(value = "weathers")
    ArrayList<WeatherCurrentModel> getWeatherCurrentService(Map<String, Object> opts, ArrayList<WeatherCurrentModel> weathers, String cityId ){

        if (cityId)
            return Arrays.asList(weatherCurrentModelRepository.findById(cityId))

        if (opts.sortBy && opts.isAscending)
          return weatherInternalLogic.sortWeather(weathers, opts)

        //example query params "{\"lat\":{\"gte\": \"55.32\", \"lte\" : \"70.02\"}}, {\"country\":{\"in\":\"IQ,GB,AE\"}}"
        if (new Boolean((String) opts.isFilter) && !opts.sortBy)
          return weatherInternalLogic.filterWeather(weathers, opts)

        //this is used during the start
        if (!weathers && !new Boolean((String) opts.isFilter))
            return (ArrayList<WeatherCurrentModel>) weatherCurrentModelRepository.findAll().findAll {item-> item.sys.country == 'SK'}

        weathers
    }



}