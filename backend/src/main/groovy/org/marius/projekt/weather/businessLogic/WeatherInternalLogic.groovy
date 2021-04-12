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

//    @Value("\${openweather.api.key.one}")
//    private String openweather_api_key_one
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
//        if (System.getenv("OPENWEATHER_API_KEY_ONE"))
            url.append("&appid=${System.getenv("OPENWEATHER_API_KEY_ONE")}" as String)
//        url.append("&appid=${openWeatherSecurityRepository.findAll().first().apiKey}" as String)
        new String (url)
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
        }
        else {
            if (m.containsKey(key))
                return m[key]
            m.findResult {
                k, v ->
                    v && (v instanceof Map || v instanceof Collection) ? findNestedKey(v, key) : null
            }
        }
    }

    void findIndicesOfArrayFilters(ArrayList indicesOfArrayFilters, ArrayList<Map> filterList){
        filterList.eachWithIndex { it, index ->

            if (it.containsKey('sys.countryName') || it.containsKey('weather.description'))
                indicesOfArrayFilters.add(index)
        }

        if (indicesOfArrayFilters.size() > 0) {
            indicesOfArrayFilters.forEach {
                def key = filterList[it].iterator().next().getKey()
                filterList[it][key]['in'] = filterList[it][key]['in'].tokenize(',')
            }
        }
    }

    def createFilterMap = { ArrayList<Map<String, Object>> filters ->
        def retMap = [:]
        filters.forEach{ Map<String, Object> item ->
            retMap << item
        }
        return retMap
    }

    def sortWeather(opts){
        /*
            opts.filters = [
                ["name": [
                    "eq" : "surany"
                    ]
                ],
                [
                 "temperature": [
                    "\$gte": 100,
                    "\$lte": 110
                    ]
                ]
            ]
         */

        def weatherCurrentModelCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(WeatherCurrentModel.class))
        def isTrue = { item -> item == true ? 1 : -1}
        ArrayList<WeatherCurrentModel> currentWeathers = weatherCurrentModelCollection.aggregate([
               new Document([
                       $match: [
                            $and: [
                                    ["sys.country": "SK"]
                            ] << (opts.filters ?: [:])
                       ],
                       ]),
                       new Document([$sort: [
                               ((String) opts.sortBy) : (isTrue.call(opts.isAscending))
                       ]]),
//                       new Document([$skip: (opts.pageNumber - 1) * opts.itemsPerPage]),
//                       new Document([$limit: opts.itemsPerPage]),
                       new Document([$project: ["creationDate": 0]])
               ]) as List
        Pageable pageable = PageRequest.of(opts.pageNumber, opts.itemsPerPage);
        final int start = (int)pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), currentWeathers.size());

        Page<WeatherCurrentModel> pages = new PageImpl<WeatherCurrentModel>(currentWeathers.subList(start, end), pageable,currentWeathers.size())
        pages
    }

    def filterWeather(opts) {
//        ArrayList<LinkedHashMap<String, LinkedHashMap<String, String>>> filterList = (ArrayList<LinkedHashMap<String, LinkedHashMap<String, String>>>) new JsonSlurper().parseText("[" + opts.filterString + "]")

        ArrayList<WeatherCurrentModel> currentWeathers = buildAggregationQuery(opts.filters, opts.itemsPerPage, opts.pageNumber)

        Pageable pageable = PageRequest.of(opts.pageNumber, opts.itemsPerPage);
        final int start = (int)pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), currentWeathers.size());

        Page<WeatherCurrentModel> pages = new PageImpl<WeatherCurrentModel>(currentWeathers.subList(start, end), pageable,currentWeathers.size())
        pages
    }
    @CompileStatic
    private static Object buildCompareParam(Object paramToChange, String[] path){
        paramToChange = path.inject(paramToChange){ weather, String p -> weather?.getAt(p) }
        if (paramToChange instanceof String && paramToChange.isNumber()) return new Double(paramToChange)
        else if (paramToChange instanceof Collection) return paramToChange.join(', ')
        return paramToChange
    }

    @CompileStatic
    private static String getCorrectFilterOperator(String filterOperator) {
        return filterOperator == 'in' ? 'contains' : filterOperator
    }

    def buildAggregationQuery(Map<String, Object> filters, Integer itemsPerPage, Integer pageNumber){

        def weatherCurrentModelCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(WeatherCurrentModel.class));

        weatherCurrentModelCollection.aggregate([
                new Document([$match: [
                        $and : [
                            ["sys.country": "SK"]
                        ] << filters
                ]]),
                new Document([$skip: (pageNumber) * itemsPerPage]),
                new Document([$limit: itemsPerPage]),
                new Document([$project : [
                        "creationDate" : 0
                ]]),
        ]) as List

    }

    //It must be changed to a Number otherwise I would be comparing strings and it works improperly wit decimal because it takes length of string into account
    def isStringNumber = { filterValue, filterOperator -> filterValue instanceof String && filterValue.isNumber() && filterOperator != "eq"  }

    def buildFilters = { filterList ->

        def filterMap = [:]
        filterList.each {

            item ->
                (LinkedHashMap) item.each {
                    filter, filterOperatorAndValue ->
                        filterOperatorAndValue.collect {
                            filterOperator, filterValue ->
                                //this if is here because some nodes are the same and I only need to append a new filter operator (like Gte and lte)
                                if (filterMap[filter]) filterMap[filter] << [("\$" + filterOperator) : ( isStringNumber.call(filterValue, filterOperator) ? new Double(filterValue) : filterValue )]
                                else filterMap << [(filter): [("\$" + filterOperator) : ( isStringNumber.call(filterValue, filterOperator) ? new Double(filterValue) : filterValue )]]
                        }.first()
                }
        }
        filterMap
    }
}
