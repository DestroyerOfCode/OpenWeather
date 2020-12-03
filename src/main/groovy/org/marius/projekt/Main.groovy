package org.marius.projekt

import org.marius.projekt.app.model.WeatherAppRepository
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@SpringBootApplication
@EnableMongoRepositories(basePackageClasses =[ WeatherModelRepository.class, OpenWeatherSecurityRepository.class, WeatherAppRepository/*, org.marius.projekt.app.model.WeatherAppRepository.class*/])
@ComponentScan('org.marius.projekt')
class Main {

    public static void main(String[] args){
        SpringApplication.run(Main.class, args);

    }
}
