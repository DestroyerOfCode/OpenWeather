package org.marius.projekt.forecast.model

import org.springframework.context.annotation.Configuration

@Configuration
class Sys {

    BigDecimal sunset
    Integer type
    String country
    String id
    BigDecimal sunrise
}
