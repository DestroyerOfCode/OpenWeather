package org.marius.projekt.config;

import com.google.common.collect.ImmutableList;
import org.apache.tools.ant.taskdefs.condition.Http;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMethod;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ResponseBuilder;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Response;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.Collections;
import java.util.List;

import static springfox.documentation.builders.PathSelectors.regex;

@Configuration
public class SwaggerConfig {

    @Bean
    public Docket swaggerSpringMvcPlugin() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("weather-api")
                .select()
//                .paths(regex("/weather/current.*"))
                .build()
                .apiInfo(apiInfo())
        .globalResponses(HttpMethod.GET,
                List.of(new ResponseBuilder()
                    .code("500")
                    .description("Chybicka!")
                    .build(),
                    new ResponseBuilder()
                    .code("200")
                    .description("OK SUCCESS")
                    .build(),
                    new ResponseBuilder()
                    .code("400")
                    .description("Invalid call")
                    .build()

                )
        );

    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("Weather Forecast")
                .description("Weather Forecast for developers")
                .contact(new Contact("Marius Babkovic", "", "marius.babkovic9@gmail.com"))
                .version("1.0")
                .build();
    }

}