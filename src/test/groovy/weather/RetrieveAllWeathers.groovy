package weather

import groovy.json.JsonBuilder
import org.junit.Assert
import org.junit.Test
import org.junit.jupiter.api.DisplayName
import org.marius.projekt.forecast.model.WeatherModel
import org.marius.projekt.forecast.model.WeatherModelRepository
import org.springframework.beans.factory.annotation.Autowired
import static io.restassured.RestAssured.given
import static org.hamcrest.Matchers.hasItem
import static org.hamcrest.Matchers.lessThanOrEqualTo
import static org.hamcrest.Matchers.not;
import static io.restassured.path.json.JsonPath.from
import static org.junit.Assert.assertTrue

class RetrieveAllWeathers {

    @Autowired
    WeatherModelRepository weatherModelRepository

    ArrayList<WeatherModel> weathers = weatherModelRepository.findAll()

    static Boolean isSortedAscending(list) {
        list.size() < 2 || (1..<list.size()).every { list[it - 1] <= list[it] }
    }

    static Boolean isSortedDescending(list) {
        list.size() < 2 || (1..<list.size()).every { list[it - 1] >= list[it] }
    }

    @Test
    @DisplayName("Get all weather data")
    void getAllWeatherData() {
        given().auth().none().contentType("application/json").when().body(weathers).
                post("/weather/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Get weather data by Id")
    void getWeatherDataById() {
        given().auth().none().contentType("application/json").pathParam("cityId", 3067696).when().body(weathers).
                post("/weather/retrieve/fromDb/{cityId}").then().statusCode(200).body("name",  hasItem("Prague"))
    }

    @Test
    @DisplayName("Sort weather data by name")
    void sortWeatherDataByName() {
        String response = given().auth().none().and().contentType("application/json").queryParams("sortBy", "name", "isAscending", true).when().body(weathers).
                post("/weather/retrieve/fromDb").asString()
        def res = from(response).getList("name")
        assertTrue( isSortedAscending(res))

    }

    @Test
    @DisplayName("Sort weather data by Latitude descending")
    void sortWeatherDataByLatitudeDescending() {
        String response = given().auth().none().and().contentType("application/json").queryParams("sortBy", "coord.lat", "isAscending", false).when().body(weathers).
                post("/weather/retrieve/fromDb").asString()
        assertTrue( isSortedDescending(from(response).getList("coord.lat")))
    }


    @Test
    @DisplayName("Sort weather data by temperature ascending")
    void sortWeatherDataByTemperatureAscending() {
        String response = given().auth().none().and().contentType("application/json").queryParams("sortBy", "weatherMain.temp", "isAscending", true).when().body(weathers).
                post("/weather/retrieve/fromDb").asString()
        assertTrue( isSortedAscending(from(response).getList("weatherMain.temp")))
    }

    @Test
    @DisplayName("Filter with multiple variables without sorting")
    void filterWithMultipleVariablesWithoutSort() {
        def lonFilterNode = Map.of("coord.lon", Map.of("gte", new BigDecimal("5.4")))
        def latFilterNode = Map.of("coord.lat", Map.of("gte", new BigDecimal("35"), "lte", new BigDecimal("55")))
        def resultFilterNode = (new JsonBuilder(lonFilterNode).toString() + "," + new JsonBuilder(latFilterNode).toString())
        Map<String, Object> opts = Map.of("filterString", resultFilterNode, "isFilter", true)

        given().auth().none().contentType("application/json").queryParams(opts).
            body(weathers).when().post("/weather/retrieve/fromDb").then().assertThat().statusCode(200).assertThat().body("coord.any{ it.lat < 55 && it.lat > 35 && it.lon > 5.4}", not(false))

    }

    @Test
    @DisplayName("Filter with multiple variables without sorting")
    void filterWeatherDataWithCountryWithoutSort() {
        def countryFilterNode = Map.of("sys.country", Map.of("eq","SA"))
        def latFilterNode = Map.of("coord.lat", Map.of("gte", "25", "lte", "55"))
        def resultFilterNode = (new JsonBuilder(countryFilterNode).toString() + "," + new JsonBuilder(latFilterNode).toString())
        Map<String, Object> opts = Map.of("filterString", resultFilterNode, "isFilter", true)

        given().auth().none().contentType("application/json").queryParams(opts).
            body(weathers).when().post("/weather/retrieve/fromDb").then().and().statusCode(200).and().body("coord.any{ it.lat < 55 && it.lat > 25}", not(false))
        .assertThat().body("sys.any{ it.country != \"SA\"}", not(true))

    }

    @Test
    @DisplayName("Filter with multiple variables without sorting with pagination")
    void filterWeatherDataWithCountryWithoutSortWithPagination() {
        def countryFilterNode = Map.of("sys.country", Map.of("eq","SA"))
        def latFilterNode = Map.of("coord.lat", Map.of("gte", "25", "lte", "55"))
        def resultFilterNode = (new JsonBuilder(countryFilterNode).toString() + "," + new JsonBuilder(latFilterNode).toString())
        Map<String, Object> opts = Map.of("filterString", resultFilterNode, "isFilter", true)

        given().auth().none().contentType("application/json").queryParams(opts).
                body(weathers).when().post("/weather/retrieve/fromDb").then().and().statusCode(200).and().body("coord.any{ it.lat < 55 && it.lat > 25}", not(false))
                .assertThat().body("sys.any{ it.country != \"SA\"}", not(true))

    }

}

