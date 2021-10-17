package weather.security

import org.junit.jupiter.api.*

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
