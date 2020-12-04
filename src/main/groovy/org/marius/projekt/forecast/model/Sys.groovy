package org.marius.projekt.forecast.model

import org.marius.projekt.misc.Mappable
import org.springframework.context.annotation.Configuration

@Configuration
class Sys implements Mappable{

    String sunset
    Integer type
    String country
    String id
    String sunrise
}
