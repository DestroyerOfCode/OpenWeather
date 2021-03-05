package org.marius.projekt;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class DatabaseConfig {

    @Value("${MONGO_URI}")
    private String mongo_uri;

    @Bean
    MongoClient mongoClient() {
        return mongo_uri == null ? MongoClients.create("mongodb://localhost:27017") : MongoClients.create(mongo_uri);
    }

    @Bean
    MongoTemplate mongoTemplate() {
        return mongo_uri == null ? new MongoTemplate(mongoClient(), "weatherManager") : new MongoTemplate(mongoClient(), "pocasie");
    }
}
