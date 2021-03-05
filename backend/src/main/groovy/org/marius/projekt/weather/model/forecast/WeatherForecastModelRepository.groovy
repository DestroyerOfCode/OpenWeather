package org.marius.projekt.weather.model.forecast

import org.marius.projekt.app.model.WeatherAppRepository
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Component

@Component
@Document(value = "weatherForecast")
interface WeatherForecastModelRepository extends WeatherAppRepository<WeatherForecastModel, String>, MongoRepository<WeatherForecastModel, String> {

}