package org.marius.projekt.weather.model.current

import org.marius.projekt.misc.Mappable
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.stereotype.Component

import java.time.LocalDateTime

@Component
@Document(collection = 'weather.current')
class WeatherCurrentModel implements Mappable {

    @Id
    String _id

    String base
    Integer visibility
    Integer timezone
    Integer weatherId
    Integer cod
    Double dt
    String name
    WeatherMain weatherMain
    Coord coord
    Clouds clouds
    Sys sys
    Wind wind
    List<Weather> weather
    LocalDateTime creationDate
    Rain rain
    Snow snow

    static class Clouds{
        Integer all
    }

    static class Coord{
        Double lon
        Double lat
    }

    static class Rain{
        Integer oneh
        Integer threeh
    }

    static class Snow{
        Integer oneh
        Integer threeh
    }

    static class Sys{
        String sunset
        Integer type
        String country
        String countryName
        String id
        String sunrise
    }
    static class Weather{
        String icon
        Integer id
        String description
        String main
    }

    static class WeatherMain{
        Double temp
        Double feels_like
        Integer humidity
        Double temp_max
        Double temp_min
        Integer pressure
        Integer sea_level
        Integer grnd_level
    }

    static class Wind{
        Float speed
        Integer deg
        Integer gust
    }

}
