package org.marius.projekt.forecast.model

import org.springframework.context.annotation.Configuration

@Configuration
class Coordinations {

    BigDecimal lon
    BigDecimal lat

    Coordinations(){
    }

    Coordinations(BigDecimal lat, BigDecimal lon){
        this.lat = lat
        this.lon = lon
    }
}
