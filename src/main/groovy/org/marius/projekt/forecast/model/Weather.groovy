package org.marius.projekt.forecast.model

import org.marius.projekt.misc.Mappable
import org.springframework.context.annotation.Configuration

@Configuration
class Weather  implements Mappable {

    String icon
    Integer id
    String description
    String main
}
