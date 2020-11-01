package org.marius.projekt.security.model;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Qualifier("security")
@Repository
public interface OpenWeatherSecurityRepository extends MongoRepository<OpenWeatherSecurity, String> {

    @Aggregation("{$match : { apiKey : ?0}}")
    OpenWeatherSecurity findByApiKey( String apiKey );

    OpenWeatherSecurity findByApiKeyNotNull( String apiKey );
//    OpenWeatherSecurity findByapiKey( String apiKey );
//    OpenWeatherSecurity findByapikey( String apiKey );

}
