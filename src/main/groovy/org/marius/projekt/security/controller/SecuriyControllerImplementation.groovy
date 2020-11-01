package org.marius.projekt.security.controller

import org.bson.types.ObjectId
import org.marius.projekt.Main
import org.marius.projekt.security.encryption.EncryptionUtil
import org.marius.projekt.security.encryption.MongoDBAfterLoadEventListener
import org.marius.projekt.security.encryption.MongoDBBeforeSaveEventListener
import org.marius.projekt.security.model.OpenWeatherSecurity
import org.marius.projekt.security.model.OpenWeatherSecurityRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.AnnotationConfigApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.data.mongodb.core.MongoOperations
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.stereotype.Component

@Component
class SecuriyControllerImplementation implements SecurityController {

    @Autowired OpenWeatherSecurityRepository openWeatherSecurityRepository
    @Autowired OpenWeatherSecurity openWeatherSecurity
    @Autowired private EncryptionUtil encryptionUtil;
    @Autowired private MongoOperations mongoOperations;
    @Autowired private MongoTemplate mongoTemplate;
    @Override
    ApplicationContext getAppCtx() {
        return new AnnotationConfigApplicationContext(Main.class)
    }

    @Bean
    public MongoDBBeforeSaveEventListener mongoDBBeforeSaveEventListener() {
        return new MongoDBBeforeSaveEventListener();
    }

    @Bean
    public MongoDBAfterLoadEventListener mongoDBAfterLoadEventListener() {
        return new MongoDBAfterLoadEventListener();
    }

    // TODO dokoncit aby malo Ine Id lebo v tom IFe sa nemeni
    @Override
    Object insertApiKey(String key){

//      this wont work because of the encrypting
//      mongoTemplate.findOne(query(where("apiKey").is(key)), OpenWeatherSecurity.class)
        if ( !openWeatherSecurityRepository.findAll().any{
            rawApiKey -> key == rawApiKey.apiKey})
        {
            openWeatherSecurity.setId(new ObjectId().get() as String)
            openWeatherSecurity.setProperty('apiKey', key )
            openWeatherSecurityRepository.insert(openWeatherSecurity)
        }

        else throw new RuntimeException('apiKey is already in the collection')
    }

    @Override
    def deleteApiKey(String key ){
        def weatherEntity;
        openWeatherSecurityRepository.findAll().any{item ->
            if (item.apiKey == key) {
                weatherEntity = item; return true }
        }
        if ( weatherEntity )
            openWeatherSecurityRepository.deleteById(weatherEntity.id)
        else throw new RuntimeException('apiKey is not in the collection')
    }
}
