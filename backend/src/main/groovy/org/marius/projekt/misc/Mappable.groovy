package org.marius.projekt.misc

trait Mappable {

    Map asMap() {
        this.metaClass.properties.findAll{ 'class' != it.name }.collectEntries {
            if( Mappable.isAssignableFrom(it.type) ){
                [ (it.name):this."$it.name"?.asMap() ]
            }else{
                return [ (it.name):this."$it.name" ]
            }
        }
    }

}