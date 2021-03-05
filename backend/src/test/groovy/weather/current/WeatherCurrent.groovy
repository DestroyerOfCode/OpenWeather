package weather.current

import groovy.json.JsonBuilder
import org.junit.Before
import org.junit.Test
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.runner.RunWith
import org.marius.projekt.Main
import org.marius.projekt.weather.model.current.WeatherCurrentModel
import org.marius.projekt.weather.model.current.WeatherCurrentModelRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit4.SpringRunner
import static io.restassured.RestAssured.given
import static org.hamcrest.Matchers.hasItem
import static org.hamcrest.Matchers.not;
import static io.restassured.path.json.JsonPath.from
import static org.junit.Assert.assertTrue

@SpringBootTest(classes = Main.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
class WeatherCurrent {

    @Autowired
    WeatherCurrentModelRepository weatherCurrentModelRepository

    private List<WeatherCurrentModel> weathers

    @BeforeEach
    void initWeathersAfterTest() {
        weathers = (ArrayList<WeatherCurrentModel>) weatherCurrentModelRepository.findAll()
    }
    @Before
    void initWeathers() {
        weathers = (ArrayList<WeatherCurrentModel>) weatherCurrentModelRepository.findAll()
    }

//    @After
//    void clearWeather() {
//        weathers.clear()
//    }

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
                post("/weather/current/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Get weather data by Id")
    void getWeatherDataById() {
        given().auth().none().contentType("application/json").pathParam("cityId", 3067696).when().body([]).
                post("/weather/current/retrieve/fromDb/{cityId}").then().statusCode(200).body("name",  hasItem("Prague"))
    }

    @Test
    @DisplayName("Sort weather data by name")
    void sortWeatherDataByName() {
        String response = given().auth().none().and().contentType("application/json").queryParams("sortBy", "name", "isAscending", true).when().body(weathers).
                post("/weather/current/retrieve/fromDb").asString()
        def res = from(response).getList("name")
        assertTrue( isSortedAscending(res))

    }

    @Test
    @DisplayName("Sort weather data by Latitude descending")
    void sortWeatherDataByLatitudeDescending() {
        String response = given().auth().none().and().contentType("application/json").queryParams("sortBy", "coord.lat", "isAscending", false).when().body(weathers).
                post("/weather/current/retrieve/fromDb").asString()
        assertTrue( isSortedDescending(from(response).getList("coord.lat")))
    }

    @Test
    @DisplayName("Sort weather data by temperature ascending")
    void sortWeatherDataByTemperatureAscending() {
        String response = given().auth().none().and().contentType("application/json").queryParams("sortBy", "weatherMain.temp", "isAscending", true).when().body(weathers).
                post("/weather/current/retrieve/fromDb").asString()
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
            body(weathers).when().post("/weather/current/retrieve/fromDb").then().assertThat().statusCode(200).assertThat().body("coord.any{ it.lat < 55 && it.lat > 35 && it.lon > 5.4}", not(false))

    }

    @Test
//    @RepeatedTest(103)
    @DisplayName("Filter with multiple variables without sorting")
    void filterWeatherDataWithCountryWithoutSort() {
        def countryFilterNode = Map.of("sys.country", Map.of("in", "SA"))
        def latFilterNode = Map.of("coord.lat", Map.of("gte", "25", "lte", "55"))
        def resultFilterNode = (new JsonBuilder(countryFilterNode).toString() + "," + new JsonBuilder(latFilterNode).toString())
        Map<String, Object> opts = Map.of("filterString", resultFilterNode, "isFilter", true,'isAdditionalFilter', false)

        given().auth().none().contentType("application/json").queryParams(opts).
            body(weathers).when().post("/weather/current/retrieve/fromDb").then().and().statusCode(200).and().body("coord.any{ it.lat < 55 && it.lat > 25}", not(false))
        .assertThat().body("sys.any{ it.country != \"SA\"}", not(true))

    }


    @Test
    @DisplayName("Filter with multiple variables without sorting with no additional filters")
    void filterWeatherDataWithCountryWithoutSortWithNoAdditionalFilter() {
        def countryFilterNode = Map.of("sys.country", Map.of("in", "SA"))
        def latFilterNode = Map.of("coord.lat", Map.of("gte", "25", "lte", "55"))
        def resultFilterNode = (new JsonBuilder(countryFilterNode).toString() + "," + new JsonBuilder(latFilterNode).toString())
        Map<String, Object> opts = Map.of("filterString", resultFilterNode, "isFilter", true, 'isAdditionalFilter', false)

        given().auth().none().contentType("application/json").queryParams(opts).
                body(weathers).when().post("/weather/current/retrieve/fromDb").then().and().statusCode(200).and().body("coord.any{ it.lat < 55 && it.lat > 25}", not(false))
                .assertThat().body("sys.any{ it.country != \"SA\"}", not(true))

    }

    @Test
    @DisplayName("Filter with multiple Countries")
    void filterWithMultipleCountries() {
        def countryFilterNode = Map.of("sys.country", Map.of("in","SA, IR, RU"))
        def resultFilterNode = (new JsonBuilder(countryFilterNode).toString())
        Map<String, Object> opts = Map.of("filterString", resultFilterNode, "isFilter", true)

        given().auth().none().contentType("application/json").queryParams(opts).when().
                body(weathers).when().post("/weather/current/retrieve/fromDb").then().and().statusCode(200).and()
                .assertThat().body("sys.any{ it.country != \"SA\" && it.country != \"IR\" && it.country != \"RU\"}", not(true))

    }

    //I dont know why the second any must be there. it['description'] should be not an arraylist, but a string
    @Test
    @DisplayName("Filter with multiple Descriptions")
    void filterWithMultipleDescriptions() {
        def countryFilterNode = Map.of("weather.description", Map.of("in", "clear sky,thunderstorm,mist"))
        def resultFilterNode = (new JsonBuilder(countryFilterNode).toString())
        Map<String, Object> opts = Map.of("filterString", resultFilterNode, "isFilter", true, 'isAdditionalFilter', false)

        given().auth().none().contentType("application/json").queryParams(opts).when().
                body(weathers).when().post("/weather/current/retrieve/fromDb").then().and().statusCode(200).and()
                .assertThat().body("weather.any{ !(it['description'].any{ item -> item in [\"clear sky\", \"thunderstorm\", \"mist\"]})}", not(true))

    }

    @Test
    @DisplayName("get all Countries")
    void getAllCountries() {
        given().auth().none().when().get("/weather/current/countries").then().and().statusCode(200)
    }

    @Test
    @DisplayName("get all Descriptions")
    void getAllDescriptions() {
        given().auth().none().when().get("/weather/current/descriptions").then().and().statusCode(200)
    }

}

