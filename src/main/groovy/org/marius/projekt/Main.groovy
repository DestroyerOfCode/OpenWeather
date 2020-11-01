package org.marius.projekt

import org.marius.projekt.forecast.model.WeatherModelRepository
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@SpringBootApplication
@EnableMongoRepositories(basePackageClasses =[ WeatherModelRepository.class, org.marius.projekt.security.model.OpenWeatherSecurityRepository.class])
@ComponentScan('org.marius.projekt')
class Main {

    public static void main(String[] args){
        SpringApplication.run(Main.class, args);

    }
}
