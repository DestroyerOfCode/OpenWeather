package org.marius.projekt.weather.service.current


import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import org.apache.groovy.json.internal.LazyMap
import org.bson.Document
import org.marius.projekt.weather.businessLogic.FilterOperatorOverload
import org.marius.projekt.weather.businessLogic.WeatherInternalLogic
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.stereotype.Service
import org.springframework.web.client.ResourceAccessException;

@Service

class WeatherService {

    @Autowired WeatherInternalLogic weatherInternalLogic
    @Autowired WeatherCurrentModelRepository weatherCurrentModelRepository

    WeatherCurrentModel findWeather(Map<String, Object> opts ){

        Object weatherMap = (LazyMap) weatherInternalLogic.parseWeatherEntityToJson(weatherInternalLogic.setOpenWeatherApiHeaders(),opts)
        ObjectMapper mapper = new ObjectMapper()

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

        WeatherCurrentModel weatherCurrentModel = mapper.convertValue(weatherMap, WeatherCurrentModel.class)
        return weatherCurrentModel
    }

    Integer findTemperature( Map<String, Object> opts){
        findWeather(opts).getAt('main').temp
    }

    ArrayList findCityIds(){
        BufferedReader idStream = new BufferedReader(new InputStreamReader(new FileInputStream('src/main/resources/cityList.json'), 'UTF-8'))
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
    ArrayList<WeatherCurrentModel> saveAllWeatherCurrentData(){
        def cityIds = findCityIds()
        ArrayList<WeatherCurrentModel> weathers = new ArrayList<WeatherCurrentModel>()
        cityIds.eachWithIndex{
            cityId, index ->
                try {

                    // this is to not overpass the minute limit for FREE API calls
                    if (index != 0 && index % 59 == 0)
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
            return (ArrayList<WeatherCurrentModel>) weatherCurrentModelRepository.findAll()

        weathers
    }



}