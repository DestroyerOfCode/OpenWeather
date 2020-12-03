package org.marius.projekt.app.model

import org.marius.projekt.forecast.model.WeatherModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.stereotype.Component

@Component
class WeatherAppRepositoryImpl implements WeatherAppRepository<WeatherModel, String> {

    @Autowired MongoTemplate mongoTemplate

//    @Override
//    WeatherModel find(Closure closure) {
//       mongoTemplate.findById()
//    }

    @Override
    WeatherModel findById(String id) {
       findById(id, null)
    }
    @Override
    WeatherModel findById(String id, Closure closure) {
       mongoTemplate.findById(id, WeatherModel.class)
    }
}
