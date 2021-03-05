package org.marius.projekt.weather.businessLogic

import org.springframework.stereotype.Component

@Component
class FilterOperatorOverload {

    def eq(def entity, def value){
        entity == value
    }

    def gte(def entity, def value){
        entity >= new Double(value)
    }

    def lte(def entity, def value){
        entity <= new Double(value)
    }

    def gt(def entity, def value){
        entity > new Double(value)
    }

    def lt(def entity, def value){
        entity < new Double(value)
    }
    //TODO urobit to pre nested
    def contains(def entity, def value){
        entity in value
    }
}
