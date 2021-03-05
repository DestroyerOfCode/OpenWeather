package org.marius.projekt.security.model;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Qualifier("security")
@Repository
public interface OpenWeatherSecurityRepository extends MongoRepository<OpenWeatherSecurity, String> {

    OpenWeatherSecurity findByApiKey( String apiKey );

    OpenWeatherSecurity findByApiKeyNotNull( String apiKey );

}
