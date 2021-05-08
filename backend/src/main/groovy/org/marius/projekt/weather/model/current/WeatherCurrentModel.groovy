package org.marius.projekt.weather.model.current

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import org.marius.projekt.misc.Mappable
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

import java.time.LocalDateTime

@ApiModel
@Document(collection = 'weather.current')
class WeatherCurrentModel implements Mappable {

    @ApiModelProperty(required = true, value = "Id of the city")
    @Id
    String _id

    @ApiModelProperty(required = false, value = "Base")
    String base
    @ApiModelProperty(required = false, value = "Visibility")
    Integer visibility
    @ApiModelProperty(required = false, value = "Timezone")
    Integer timezone
    @ApiModelProperty(required = false, value = "Weather Id")
    Integer weatherId
    @ApiModelProperty(required = false, value = "cod")
    Integer cod
    @ApiModelProperty(required = false, value = "Day Time")
    Double dt
    @ApiModelProperty(required = true, value = "Name of the City")
    String name
    @ApiModelProperty(required = true, value = "Temperatures")
    WeatherMain weatherMain
    @ApiModelProperty(required = true, value = "Coordinates")
    Coord coord
    @ApiModelProperty(required = false, value = "Clouds")
    Clouds clouds
    @ApiModelProperty(required = false, value = "Sys")
    Sys sys
    @ApiModelProperty(required = false, value = "Wind")
    Wind wind
    @ApiModelProperty(required = false, value = "Descriptions and icons")
    List<Weather> weather
    @ApiModelProperty(required = false, value = "Date of Creation of object")
    LocalDateTime creationDate
    @ApiModelProperty(required = false, value = "Rain")
    Rain rain
    @ApiModelProperty(required = false, value = "Snow")
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
