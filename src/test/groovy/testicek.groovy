import io.restassured.RestAssured
import io.restassured.module.mockmvc.RestAssuredMockMvc
import org.junit.Assert
import org.junit.Rule
import org.junit.function.ThrowingRunnable
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.DisplayName
import org.junit.rules.ExpectedException
import org.springframework.context.annotation.Description
import org.springframework.test.web.servlet.MockMvc
import org.springframework.web.client.HttpClientErrorException

class testicek {

    @Rule
    public final ExpectedException exception = ExpectedException.none()

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
    @Test
    @DisplayName("get Single Weather Data Fail")
    void getSingleWeatherDataFail() {
        Assert.assertThrows(HttpClientErrorException.class, { ->
            given().auth().none().and().params([:]).when().
                    get("/weather")
        })
    }
}
import static io.restassured.RestAssured.*
//import org.springframework.security.test.web.servlet.request.httpBasic

import org.junit.Test;
