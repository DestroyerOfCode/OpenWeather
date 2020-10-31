package org.marius.projekt.forecast.model

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Configuration
@Document(collection = 'Weather')
class WeatherModel {

    @Id
    String id

    String base
    Integer visibility

    @Autowired
    WeatherMain weatherMain
}
