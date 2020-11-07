package org.marius.projekt.forecast.model

import org.springframework.context.annotation.Configuration

@Configuration
class Coord {

    BigDecimal lon
    BigDecimal lat

    Coord(){
    }

    Coord(BigDecimal lat, BigDecimal lon){
        this.lat = lat
        this.lon = lon
    }
}
