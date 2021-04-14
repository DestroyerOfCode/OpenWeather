package weather.current


import org.junit.Test
import org.junit.jupiter.api.DisplayName

import static io.restassured.RestAssured.given

class WeatherCurrentInsertion {

    @Test
    @DisplayName("get Single Weather Data")
    void getSingleWeatherData() {
        given().auth().none().and().queryParams(['cityName':'Prague', 'units': 'metric']).when().
                get("/weather/current").
                then().
                statusCode(202)
    }

    @Test
    @DisplayName("get Single Weather Data With City Id  Random")
    void getSingleWeatherDataWithCityIdRandom() {
        given().auth().none().and().queryParams(['cityId': '3067696', 'units': 'metric']).when().
                get("/weather/current").
                then().
                statusCode(202)
    }

    @Test
    @DisplayName("get Single Weather Data With City Id Real")
    void getSingleWeatherDataWithCityIdReal() {
        given().auth().none().and().queryParams(['cityId':'3067696', 'units': 'metric']).when().
                get("/weather/current").
                then().
                statusCode(202)
    }

    @Test
    @DisplayName("Save all weather Data from resourcs")
    void saveAllWeatherCurrentDataFromResource() {
        given().auth().none().when().
                post("/weather/current/save/all").
                then().
                statusCode(201)
    }

}

