package org.marius.projekt.security.encryption

import org.bson.Document
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener
import org.springframework.data.mongodb.core.mapping.event.AfterLoadEvent

class MongoDBAfterLoadEventListener extends AbstractMongoEventListener<Object> {

    @Autowired
    private EncryptionUtil encryptionUtil;

    @Override
    void onAfterLoad(AfterLoadEvent<Object> event) {

        Document eventObject = event.getDocument();

        List<String> keysToDecrypt = Arrays.asList("apiKey");

        eventObject.keySet().forEach{key ->
            if (keysToDecrypt.contains(key)) {
                eventObject.put(key, this.encryptionUtil.decrypt(eventObject.get(key).toString()));
            }
        }

        super.onAfterLoad(event);
    }
}