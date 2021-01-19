package org.marius.projekt.app.model

import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.stereotype.Component

@Component
class WeatherAppRepositoryImpl implements WeatherAppRepository<WeatherCurrentModel, String> {

    @Autowired MongoTemplate mongoTemplate

    @Override
    WeatherCurrentModel findById(String id) {
       findById(id, null)
    }
    @Override
    WeatherCurrentModel findById(String id, Closure closure) {
       mongoTemplate.findById(id, WeatherCurrentModel.class)
    }
}
