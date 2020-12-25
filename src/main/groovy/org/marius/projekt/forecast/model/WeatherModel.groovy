package org.marius.projekt.forecast.model

import org.marius.projekt.misc.Mappable
import org.springframework.context.annotation.Configuration
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

import java.time.LocalDateTime

@Configuration
@Document(collection = 'Weather')
class WeatherModel implements Mappable {

    @Id
    String _id

    String base
    Integer visibility
    Integer timezone
    Integer weatherId
    Integer cod
    BigDecimal dt
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

}
