package org.marius.projekt.security.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.stereotype.Component

@Component
@Document(collection = "openWeather.security")
class OpenWeatherSecurity {

    @Id
    String id

    String apiKey
}
