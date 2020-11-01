package org.marius.projekt.security.model

import org.springframework.context.annotation.Configuration
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Configuration
@Document(collection = "openWeather.security")
class OpenWeatherSecurity {

    @Id
    String id

    String apiKey
}
