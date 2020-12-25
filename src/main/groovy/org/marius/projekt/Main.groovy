package org.marius.projekt

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.marius.projekt.app.model.WeatherAppRepository
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@SpringBootApplication
@EnableMongoRepositories(basePackageClasses =[ WeatherModelRepository.class, OpenWeatherSecurityRepository.class, WeatherAppRepository/*, org.marius.projekt.app.model.WeatherAppRepository.class*/])
@ComponentScan('org.marius.projekt')
class Main {

    public static void main(String[] args){
        SpringApplication.run(Main.class, args);

    }
    public @Bean MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017");
    }

    public @Bean MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "weatherManager");
    }
}
