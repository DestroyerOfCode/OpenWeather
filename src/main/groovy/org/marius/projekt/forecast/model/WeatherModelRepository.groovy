package org.marius.projekt.forecast.model

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import org.springframework.stereotype.Repository

@Qualifier("weather")
@Repository
interface WeatherModelRepository extends MongoRepository<WeatherModel, String> {

}