package org.marius.projekt.forecast.model

import org.marius.projekt.misc.Mappable
import org.springframework.context.annotation.Configuration

@Configuration()
class WeatherMain implements Mappable  {

    BigDecimal temp
    BigDecimal feels_like
    Integer humidity
    BigDecimal temp_max
    BigDecimal temp_min
    Integer pressure
    Integer sea_level
    Integer grnd_level
}
