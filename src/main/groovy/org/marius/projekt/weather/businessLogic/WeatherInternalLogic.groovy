package org.marius.projekt.weather.businessLogic

import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import org.bson.Document
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.springframework.beans.factory.annotation.Autowired
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
        url.append("&appid=${openWeatherSecurityRepository.findAll().first().apiKey}" as String)
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

    def sortWeather(ArrayList<WeatherCurrentModel> weathers, opts){
        String sortString = opts.sortBy
        String[] path = sortString.split(/\./)
        if (!weathers) weatherCurrentModelRepository.findAll()
        weathers =  weathers.sort() {
            Object a, Object b ->
                a = buildCompareParam(a, path)
                b = buildCompareParam(b, path)
                new Boolean((String) opts.isAscending) ? a <=> b : b <=> a
        }
        weathers
    }

    def filterWeather(weathers, opts) {
        ArrayList<LinkedHashMap<String, LinkedHashMap<String, String>>> filterList = (ArrayList<LinkedHashMap<String, LinkedHashMap<String, String>>>) new JsonSlurper().parseText("[" + opts.filterString + "]")

        // I need index because I cant get map element of array without one
        // I need to change it from string to array of strings because in query parameters of URI it
        // is impossible to send arrays and I am sending it as string in format 'in=AO, AE, RU'
        // in cases where multiple filters containing multiple values I must get indices of all those filters
        // to change the filter values from strings to array
        ArrayList<Integer> indicesOfArrayFilters = new ArrayList()
        findIndicesOfArrayFilters(indicesOfArrayFilters, filterList)

        if (!new Boolean((String) opts.isAdditionalFilter))
            weathers = buildAggregationQuery(filterList)
        else {
            filterList.forEach { filterItem ->

                String filterName = filterItem.entrySet().stream().findFirst().get().getKey()
                LinkedHashMap<String, String> filterOperatorsMap = (LinkedHashMap<String, String>) filterItem.entrySet().stream().findFirst().get().getValue()

                if (filterName) {
                    filterOperatorsMap.forEach { filterOperator, filterValue ->
                        String[] path = filterName.split(/\./)
                        weathers = (ArrayList<WeatherCurrentModel>) weathers.findAll { it ->
                            def OverloadedFilterOperator = getCorrectFilterOperator(filterOperator)
                            filterOperatorOverload."${OverloadedFilterOperator}"(buildCompareParam(it.asMap(), path), filterValue)
                        }
                    }
                }
            }
        }
        weathers
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

    def buildAggregationQuery(def filterList){

        def weatherCurrentModelCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(WeatherCurrentModel.class));

        weatherCurrentModelCollection.aggregate([
                new Document([$match: [
                        $and : [
                            ["sys.country": "SK"]
                        ] << buildFilters.call(filterList)
                ]]),
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
