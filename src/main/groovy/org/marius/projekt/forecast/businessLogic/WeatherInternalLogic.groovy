package org.marius.projekt.forecast.businessLogic

import groovy.json.JsonSlurper
import org.marius.projekt.forecast.model.WeatherModel
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.springframework.beans.factory.annotation.Autowired
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
//    @Autowired WeatherModelRepository weatherModelRepository
    @Autowired OpenWeatherSecurityRepository openWeatherSecurityRepository

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
        url.append("&appid=${openWeatherSecurityRepository.findAll().last().apiKey}" as String)
        new String (url)
    }

    HttpEntity setHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        return entity
    }


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

            if (it.containsKey('sys.country') || it.containsKey('weather.description'))
                indicesOfArrayFilters.add(index)
        }

        if (indicesOfArrayFilters.size() > 0) {
            indicesOfArrayFilters.forEach {
                def key = filterList[it].iterator().next().getKey()
                filterList[it][key]['in'] = filterList[it][key]['in'].tokenize(',')
            }
        }
    }
}
