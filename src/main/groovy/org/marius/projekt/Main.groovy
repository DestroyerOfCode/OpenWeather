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
//
//    @Bean
//    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
//        return { args ->
//
//            System.out.println("Let's inspect the beans provided by Spring Boot:");
//
//            String[] beanNames = ctx.getBeanDefinitionNames();
//            Arrays.sort(beanNames);
//            for (String beanName : beanNames) {
//                System.out.println(beanName);
//            }
//w
//        };
//    }
}
