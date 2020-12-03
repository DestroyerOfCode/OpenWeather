package org.marius.projekt.forecast.businessLogic

import org.springframework.stereotype.Component

@Component
class FilterOperatorOverload {

    def eq(def entity, def value){
        entity == value
    }

    def gte(def entity, def value){
        entity >= value
    }

    def lte(def entity, def value){
        entity <= value
    }

    def gt(def entity, def value){
        entity > value
    }

    def lt(def entity, def value){
        entity < value
    }

    //TODO urobit to pre nested
    def contains(def entity, def value){
        value in entity
    }
}
