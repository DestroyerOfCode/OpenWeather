package org.marius.projekt.security.encryption

import groovy.transform.CompileStatic
import org.bson.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent

import java.time.LocalDateTime

@CompileStatic
class MongoDBBeforeSaveEventListener extends AbstractMongoEventListener<Object> {

    @Autowired
    private EncryptionUtil encryptionUtil;

    @Override
    void onBeforeSave(BeforeSaveEvent<Object> event) {

        Document eventObject = event.getDocument();
        List<String> keysToEncrypt = Arrays.asList("apiKey");

        eventObject.keySet().any{key ->
            if (!keysToEncrypt.contains(key))
                return false
            eventObject.put(key, this.encryptionUtil.encrypt(eventObject.get(key).toString()));
            return true
        }
        eventObject.put('creationDate', LocalDateTime.now())
        super.onBeforeSave(event);
    }
}