package org.marius.projekt.security.model;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Qualifier("security")
@Repository
public interface OpenWeatherSecurityRepository extends MongoRepository<OpenWeatherSecurity, String> {

    OpenWeatherSecurity findByApiKey( String apiKey );
    OpenWeatherSecurity findByApiKeyNotNull( String apiKey );
//    OpenWeatherSecurity findByapiKey( String apiKey );
//    OpenWeatherSecurity findByapikey( String apiKey );

}
