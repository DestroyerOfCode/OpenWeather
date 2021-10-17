package org.marius.projekt.weather.model.current

import org.marius.projekt.app.model.WeatherAppRepository
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface WeatherCurrentModelRepository extends WeatherAppRepository<WeatherCurrentModel, String>, MongoRepository<WeatherCurrentModel, String>  {

    PageImpl<WeatherCurrentModel> findAllBySysCountry(Pageable pageable, String country);
}