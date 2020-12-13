package weather


import org.junit.Assert
import org.junit.Test
import org.junit.jupiter.api.DisplayName
import org.springframework.web.client.HttpClientErrorException

import static io.restassured.RestAssured.given

//import org.springframework.security.test.web.servlet.request.httpBasic

import static org.hamcrest.Matchers.hasItem;

class WeatherInsertion {

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

    @Test
    @DisplayName("Save all weather Data from resourcs")
    void saveAllWeatherDataFromResource() {
        given().auth().none().when().
                post("/weather/save/all").
                then().
                statusCode(201)
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


}

