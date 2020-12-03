package org.marius.projekt.forecast.model

import org.marius.projekt.app.model.WeatherAppRepository
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Qualifier("weather")
@Repository
interface WeatherModelRepository extends WeatherAppRepository<WeatherModel, String>, MongoRepository<WeatherModel, String>  {

}