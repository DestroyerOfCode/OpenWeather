package org.marius.projekt.security.encryption

import org.bson.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent

class MongoDBBeforeSaveEventListener extends AbstractMongoEventListener<Object> {

    @Autowired
    private EncryptionUtil encryptionUtil;

    @Override
    void onBeforeSave(BeforeSaveEvent<Object> event) {

        Document eventObject = event.getDocument();
        List<String> keysToEncrypt = Arrays.asList("apiKey");

        eventObject.keySet().forEach{key ->
            if (keysToEncrypt.contains(key)) {
                eventObject.put(key, this.encryptionUtil.encrypt(eventObject.get(key).toString()));
            }
        }

        super.onBeforeSave(event);
    }
}