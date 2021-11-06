package org.marius.projekt.weather.businessLogic

import com.mongodb.client.MongoCollection
import groovy.json.JsonSlurper
import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import org.bson.BsonDocument
import org.bson.Document
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.*
import org.springframework.stereotype.Component
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate

@Component
class WeatherInternalLogic {

    private static final String uriBase = 'http://api.openweathermap.org/data/2.5/weather?'
    private static final Logger logger = LogManager.getLogger(WeatherInternalLogic.class);

    @Autowired
    RestTemplate restTemplate
    @Autowired
    OpenWeatherSecurityRepository openWeatherSecurityRepository
    @Autowired
    MongoTemplate mongoTemplate

    /***
     *
     * @param entity
     * @param opts
     * restTemplate.exchange calls the web service
     * @return
     */
    Object parseWeatherEntityToJson(HttpEntity<String> entity, Map<String, Object> opts) {

        try {
            StringBuilder url = new StringBuilder(uriBase)
            return new JsonSlurper().parseText(restTemplate.exchange(buildUrl(opts, url),
                    HttpMethod.GET, entity,
                    String.class)
                    .getBody().toString()
            )
        } catch (HttpClientErrorException e) {
            logger.error("Error getting weather ${opts.cityName}", e)
            throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, e.toString())
        }

    }

    /***
     *
     * @param opts
     * @param url
     * @return new String cause url cant be stringBuilder
     */
    String buildUrl(Map<String, Object> opts, StringBuilder url) {

        opts.each { k, v ->
            switch (k) {
                case ('cityId'): url.append("id=${v}" as String); break;
                case ('cityName'): url.append("q=${v}" as String); break;
                case ('state'): url.append(",${v}" as String); break;
                case ('zipCode'): url.append("zip=${v}" as String); break;
                case ('countryCode'): url.append(",${v}" as String); break;
            }
        }

        url.append("&units=${opts.get('units')}" as String)

        if (System.getenv("OPENWEATHER_API_KEY_ONE"))
            url.append("&appid=${System.getenv("OPENWEATHER_API_KEY_ONE")}" as String)

        else
            url.append("&appid=${openWeatherSecurityRepository.findAll().first().apiKey}" as String)

        new String(url)
    }

    HttpEntity setOpenWeatherApiHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        return entity
    }


    //depth first algorithm to find path in mongo given the most nested key
    def findNestedKey(def m, String key) {
        if (!m)
            return
        if (m instanceof Collection) {
            m.forEach { item ->
                if (!item)
                    return
                if (item.asMap().containsKey(key)) return item.asMap()[key]
                item.asMap().findResult {
                    k, v ->
                        v && v instanceof Map ? findNestedKey(v, key) : null
                }
            }
        } else {
            if (m.containsKey(key))
                return m[key]
            m.findResult {
                k, v ->
                    v && (v instanceof Map || v instanceof Collection) ? findNestedKey(v, key) : null
            }
        }
    }

    def getCurrentWeather(opts) {

        ArrayList<WeatherCurrentModel> currentWeathers = buildAggregationQuery(opts.filters, opts.sortBy, opts.isAscending)

        Pageable pageable = PageRequest.of(opts.pageNumber, opts.itemsPerPage);
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), currentWeathers.size());

        Page<WeatherCurrentModel> pages = new PageImpl<WeatherCurrentModel>(currentWeathers.subList(start, end),
                pageable,
                currentWeathers.size()
        )
        pages
    }

    def buildAggregationQuery(Map<String, Object> filters, String sortBy, Boolean isAscending) {

        def weatherCurrentModelCollection = mongoTemplate.getCollection(
                mongoTemplate.getCollectionName(WeatherCurrentModel.class)
        )

        def isTrue = { item -> item == true ? 1 : -1 }

        weatherCurrentModelCollection.aggregate([
                new Document([$match: [
                        $and: [
                                ["sys.country": "SK"]
                        ] << filters
                ]]),
                new Document([$sort: [
                        ((String) sortBy): (isTrue.call(isAscending))
                ]]),
                new Document([$project: [
                        "creationDate": 0
                ]]),
        ]) as List

    }

    ArrayList<Document> getCountryNames(weatherMap) {
        MongoCollection weatherCurrentModelCollection = mongoTemplate.getCollection(
                mongoTemplate.getCollectionName(WeatherCurrentModel.class)
        )

        return weatherCurrentModelCollection.aggregate([BsonDocument.parse('''
            {
                "\$match": {
                    "sys.country":"''' + weatherMap.sys.country + '''"
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
    }

    static def renameKeysStartingWithNumber(weatherMap) {
        //       I already have a Main class and the beans were intersecting each other so i named it weatherMain
        Object o = weatherMap.remove('main')
        weatherMap.put('weatherMain', o)
        o = weatherMap.remove('id')
        weatherMap.put('_id', o)

        // in the jsonnode I receive there are keys starting with a numeral so I have to change it to start with literal
        if (weatherMap.containsKey('rain')) {
            o = weatherMap.rain.remove('1h')
            weatherMap.rain.put('oneh', o)
            o = weatherMap.rain.remove('3h')
            weatherMap.rain.put('threeh', o)
        }

        if (weatherMap.containsKey('snow')) {
            o = weatherMap.snow.remove('1h')
            weatherMap.snow.put('oneh', o)
            o = weatherMap.snow.remove('3h')
            weatherMap.snow.put('threeh', o)
        }
    }

    def renameKeysStartingWithNumberForecast(weatherDailyMap) {
        weatherDailyMap.hourly.findAll { it.rain }.collect {
            it.rain << ["_1h": it.rain."1h"]
            it.rain.remove("1h")
        }

        weatherDailyMap.hourly.findAll { it.snow }.collect {
            it.snow << ["_1h": it.snow."1h"]
            it.snow.remove("1h")
        }

    }

}
