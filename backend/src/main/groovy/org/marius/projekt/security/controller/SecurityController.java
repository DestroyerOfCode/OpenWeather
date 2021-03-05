package org.marius.projekt.security.controller;

import groovy.transform.CompileStatic;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@CompileStatic
@ResponseBody
@Controller
@RequestMapping("/security")
public interface SecurityController {

//    @Autowired ApplicationContext appCtx =  new AnnotationConfigApplicationContext(Main.class);
    ApplicationContext getAppCtx();

    @RequestMapping(value = "/{key}/insertKey", method = POST)
    default Object insertApiKey(@PathVariable String key){
        return new ResponseEntity<Object>((Object) getAppCtx().getBean(SecuriyControllerImplementation.class).insertApiKey(key), HttpStatus.CREATED);
    }
    @RequestMapping(value = "/{key}/deleteKey", method = POST)
    default Object deleteApiKey(@PathVariable String key){
        return new ResponseEntity<Object>((Object) getAppCtx().getBean(SecuriyControllerImplementation.class).deleteApiKey(key), HttpStatus.CREATED);
    }
}
