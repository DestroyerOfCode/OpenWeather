package org.marius.projekt.app.model;

import groovy.lang.Closure;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;

@Repository
public interface WeatherAppRepository<T, ID> {

//   T find(Closure closure);
   T findById(String id);
   T findById(String id, Closure closure);
}
