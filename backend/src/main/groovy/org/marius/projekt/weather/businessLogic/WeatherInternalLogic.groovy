package org.marius.projekt.weather.businessLogic

import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import org.bson.BsonDocument
import org.bson.Document
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate

@Component
class WeatherInternalLogic {

    def uriBase ='http://api.openweathermap.org/data/2.5/weather?'

    @Autowired RestTemplate restTemplate
    @Autowired OpenWeatherSecurityRepository openWeatherSecurityRepository
    @Autowired WeatherCurrentModelRepository weatherCurrentModelRepository
    @Autowired FilterOperatorOverload filterOperatorOverload
    @Autowired MongoTemplate mongoTemplate

    /***
     *
     * @param entity
     * @param opts
     * restTemplate.exchange calls the web service
     * @return
     */
    Object parseWeatherEntityToJson(HttpEntity<String> entity, Map<String, Object> opts){

        try {
            StringBuilder url = new StringBuilder(uriBase)
            return new JsonSlurper().parseText(restTemplate.exchange(buildUrl(opts, url), HttpMethod.GET, entity, String.class).getBody().toString())
        } catch(HttpClientErrorException e) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, e.toString())
        }

    }

    /***
     *
     * @param opts
     * @param url
     * @return new String cause url cant be stringBuilder
     */
    String buildUrl(Map<String, Object> opts, StringBuilder url){

        opts.each{k, v ->
            switch (k){
                case ( 'cityId' ) : url.append("id=${v}" as String); break;
                case ( 'cityName' ) : url.append("q=${v}" as String); break;
                case ( 'state' ) : url.append(",${v}" as String); break;
                case ( 'zipCode' ) : url.append("zip=${v}" as String); break;
                case ( 'countryCode' ) : url.append(",${v}" as String); break;
            }
        }

        url.append("&units=${opts.get('units')}" as String)
        if (System.getenv("OPENWEATHER_API_KEY_ONE"))
            url.append("&appid=${System.getenv("OPENWEATHER_API_KEY_ONE")}" as String)
        else url.append("&appid=${openWeatherSecurityRepository.findAll().first().apiKey}" as String)
        new String (url)
    }

    HttpEntity setOpenWeatherApiHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        return entity
    }

    def getCurrentWeather(opts) {

        ArrayList<WeatherCurrentModel> currentWeathers = buildAggregationQuery(opts.filters, opts.sortBy, opts.isAscending)

        Pageable pageable = PageRequest.of(opts.pageNumber, opts.itemsPerPage);
        final int start = (int)pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), currentWeathers.size());

        Page<WeatherCurrentModel> pages = new PageImpl<WeatherCurrentModel>(currentWeathers.subList(start, end), pageable,currentWeathers.size())
        pages
    }

    def buildAggregationQuery(Map<String, Object> filters, String sortBy, Boolean isAscending){

        def weatherCurrentModelCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(WeatherCurrentModel.class));
        def isTrue = { item -> item == true ? 1 : -1}

        weatherCurrentModelCollection.aggregate([
                new Document([$match: [
                        $and : [
                            ["sys.country": "SK"]
                        ] << filters
                ]]),
                new Document([$sort: [
                        ((String) sortBy) : (isTrue.call(isAscending))
                ]]),
                new Document([$project : [
                        "creationDate" : 0
                ]]),
        ]) as List

    }
}
