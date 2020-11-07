package org.marius.projekt.forecast.model

import org.springframework.context.annotation.Configuration

@Configuration()
class WeatherMain {

    BigDecimal temp
    BigDecimal feels_like
    Integer humidity
    BigDecimal temp_max
    BigDecimal temp_min
    Integer pressure
}
