package org.marius.projekt.forecast.model

import org.springframework.context.annotation.Configuration

@Configuration()
class WeatherMain {

    BigDecimal temp
    BigDecimal feels_like

    def WeatherMain(){

    }
    def WeatherMain(BigDecimal temp, BigDecimal feels_like){
        this.temp = temp
        this.feels_like = feels_like
    }
}
