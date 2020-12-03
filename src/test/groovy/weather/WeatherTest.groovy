package weather


import org.junit.Assert
import org.junit.Test
import org.junit.jupiter.api.DisplayName
import org.springframework.web.client.HttpClientErrorException

import static io.restassured.RestAssured.given

//import org.springframework.security.test.web.servlet.request.httpBasic

import static org.hamcrest.Matchers.hasItem;

class WeatherTest {

    @Test
    @DisplayName("get Single Weather Data")
    void getSingleWeatherData() {
        given().auth().none().and().queryParams(['cityName':'Prague', 'units': 'metric']).when().
                get("/weather").
                then().
                statusCode(202)
    }

    @Test
    @DisplayName("get Single Weather Data With City Id Random")
    void getSingleWeatherDataWithCityIdRandom() {
        given().auth().none().and().queryParams(['cityId': '3067696', 'units': 'metric']).when().
                get("/weather").
                then().
                statusCode(202)
    }

    @Test
    @DisplayName("get Single Weather Data With City Id Real")
    void getSingleWeatherDataWithCityIdReal() {
        given().auth().none().and().queryParams(['cityId':'3067696', 'units': 'metric']).when().
                get("/weather").
                then().
                statusCode(202)
    }

    //TODO How to Test throwing an exception????
//    @Test
//    @DisplayName("get Single Weather Data Fail")
//    void getSingleWeatherDataFail() {
//        Assert.assertThrows(HttpClientErrorException.class, { ->
//            given().auth().none().and().params([:]).when().
//                    get("/weather")
//        })
//    }

    @Test
    @DisplayName("Sort weather data")
    void sortWeatherData(){
        given().auth().none().and().queryParams("sortBy", "name", "isAscending", true).when().
        get("/weather/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Filter weather data")
    void filterWeatherData(){
        Map<String, Object> filterMap = Map.of("name", "Baghdad");
        given().auth().none().contentType("application/json").queryParams( "filterOperator", "eq", "sortBy", "name", "isAscending", true).
                body(filterMap).when().
        get("/weather/retrieve/fromDb").then().statusCode(200).body("name", hasItem("Baghdad"))
    }
    @Test
    @DisplayName("Get all weather data")
    void getAllWeatherData(){
        given().auth().none().when().
        get("/weather/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Get weather data by Id")
    void getWeatherDataById(){
       given().auth().none().when().
        get("/weather/retrieve/fromDb/3067696").then().statusCode(200).body("name", hasItem("Prague"))
    }
}

