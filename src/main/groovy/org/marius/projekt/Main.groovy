package org.marius.projekt

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import org.marius.projekt.app.model.WeatherAppRepository
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories
import org.springframework.transaction.annotation.EnableTransactionManagement

@EnableTransactionManagement
@EnableAutoConfiguration
@SpringBootApplication
@EnableMongoRepositories(basePackageClasses =[ WeatherCurrentModelRepository.class, OpenWeatherSecurityRepository.class, WeatherAppRepository/*, org.marius.projekt.app.model.WeatherAppRepository.class*/])
@ComponentScan('org.marius.projekt')
class Main {

    static void main(String[] args){
        SpringApplication.run(Main.class, args);

    }
    @Bean MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017");
    }

    @Bean MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "weatherManager");
    }
}
