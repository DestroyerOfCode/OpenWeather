package weather

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.TestMethodOrder

import static io.restassured.RestAssured.given

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ApiKeyOperations {

    @Test
    @Order(1)
    @DisplayName(value = "Insert Api Key")
    void insertApiKey(){
        given().auth().none().pathParam("apiKey", "randomApiKey").post("/security/{apiKey}/insertKey").
        then().statusCode(200)
    }

    @Test
    @Order(2)
    @DisplayName(value = "Delete Api Key")
    void deleteApiKey(){
        given().auth().none().pathParam("apiKey", "randomApiKey").post("/security/{apiKey}/deleteKey").
        then().statusCode(200)
    }
}
