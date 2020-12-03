package org.marius.projekt.forecast.model

import org.marius.projekt.misc.Mappable
import org.springframework.context.annotation.Configuration

@Configuration
class Coord implements Mappable {

    BigDecimal lon
    BigDecimal lat

    Coord(){
    }

    Coord(BigDecimal lat, BigDecimal lon){
        this.lat = lat
        this.lon = lon
    }
}
