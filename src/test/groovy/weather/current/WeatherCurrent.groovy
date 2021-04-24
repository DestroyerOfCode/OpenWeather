package weather.current

import org.junit.Test
import org.junit.jupiter.api.DisplayName
import org.junit.runner.RunWith
import org.marius.projekt.Main
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit4.SpringRunner
import static io.restassured.RestAssured.given

@SpringBootTest(classes = Main.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
class WeatherCurrent {

    static Boolean isSortedAscending(list) {
        list.size() < 2 || (1..<list.size()).every { list[it - 1] <= list[it] }
    }

    static Boolean isSortedDescending(list) {
        list.size() < 2 || (1..<list.size()).every { list[it - 1] >= list[it] }
    }

    @Test
    @DisplayName("Get all weather data")
    void getAllWeatherData() {
        given().auth().none().contentType("application/json").when().body(["pageNumber": 0, "itemsPerPage": 1000]).
                post("/weather/current/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Sort weather data by name")
    void sortWeatherDataByName() {
        given().auth().none().and().contentType("application/json")
        .when().body(["pageNumber": 0, "itemsPerPage": 1000, "sortBy": "name", "isAscending": true])
        .post("/weather/current/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Sort weather data by Latitude descending")
    void sortWeatherDataByLatitudeDescending() {
        given().auth().none().and().contentType("application/json")
        .when().body(["pageNumber": 0, "itemsPerPage": 1000,"sortBy": "coord.lat", "isAscending": false])
        .post("/weather/current/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Sort weather data by temperature ascending")
    void sortWeatherDataByTemperatureAscending() {
        String response = given().auth().none().and().contentType("application/json")
        .when().body(["pageNumber": 0, "itemsPerPage": 1000,"sortBy": "weatherMain.temp", "isAscending": true])
        .post("/weather/current/retrieve/fromDb").then().statusCode(200)
    }

    @Test
    @DisplayName("Filter with multiple variables without sorting")
    void filterWithMultipleVariablesWithoutSort() {
        given().auth().none().contentType("application/json")
            .when().body(["pageNumber": 0, "itemsPerPage": 1000, "filters": ["coord.lon": ["\$gte": new Double("5.4")],
                                                                                              "coord.lat": ["\$gte": new Double("35"), "\$lte": new Double("55")]]
            ])
            .when().post("/weather/current/retrieve/fromDb")
            .then().assertThat().statusCode(200)


    }

    @Test
//    @RepeatedTest(103)
    @DisplayName("Filter with multiple variables without sorting")
    void getCurrentWeatherDataWithCountryWithoutSort() {
        given().auth().none().contentType("application/json")
        .when().body(["pageNumber": 0, "itemsPerPage": 1000, "sortBy": "name","filters": ["sys.country": ["\$in": ["SK"]],
                                                                                          "coord.lat": ["\$gte": new Double("35"), "\$lte": new Double("55")]]
        ]).when().post("/weather/current/retrieve/fromDb")
        .then().statusCode(200)
    }

    @Test
    @DisplayName("Filter with multiple variables without sorting with no additional filters")
    void getCurrentWeatherDataWithCountryWithoutSortWithNoAdditionalFilter() {
        given().auth().none().contentType("application/json")
                .when().body(["pageNumber": 0, "itemsPerPage": 1000, "sortBy": "name","filters": ["sys.country": ["\$in": ["SK"]],
                                                                                                  "coord.lat": ["\$gte": new Double("25"), "\$lte": new Double("55")]]
        ]).when().post("/weather/current/retrieve/fromDb")
        .then().statusCode(200)
    }

    @Test
    @DisplayName("Filter with multiple Countries")
    void filterWithMultipleCountries() {

        given().auth().none().contentType("application/json")
                .when().body(["pageNumber": 0, "itemsPerPage": 1000, "sortBy": "name","filters": ["sys.country": ["\$in": ["SK", "IR", "RU"]]]
        ]).when().post("/weather/current/retrieve/fromDb")
        .then().statusCode(200)
    }

    @Test
    @DisplayName("Filter with multiple Descriptions")
    void filterWithMultipleDescriptions() {
        given().auth().none().contentType("application/json")
                .when().body(["pageNumber": 0, "itemsPerPage": 1000, "sortBy": "name","filters": ["weather.description": ["\$in": ["clear sky","thunderstorm","mist"]]]
        ]).when().post("/weather/current/retrieve/fromDb")
        .then().statusCode(200)
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

