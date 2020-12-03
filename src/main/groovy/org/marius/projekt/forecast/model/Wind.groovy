package org.marius.projekt.forecast.model

import org.marius.projekt.misc.Mappable
import org.springframework.context.annotation.Configuration

@Configuration
class Wind implements Mappable {

    Float speed
    Integer deg
    Integer gust

    /*Map asMap() {
        this.class.declaredFields.findAll { !it.synthetic }.collectEntries {
            [ (it.name):this."$it.name" ]
        }
    }*/
}
