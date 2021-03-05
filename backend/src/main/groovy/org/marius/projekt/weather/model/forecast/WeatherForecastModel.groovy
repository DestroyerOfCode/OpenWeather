package org.marius.projekt.weather.model.forecast

import org.marius.projekt.weather.model.current.WeatherCurrentModel.Weather
import org.marius.projekt.misc.Mappable
import org.springframework.stereotype.Component

@Component
class WeatherForecastModel implements Mappable {

    BigDecimal lon
    BigDecimal lat
    String timezone
    BigInteger timezone_offset
    Current current
    ArrayList<Hourly> hourly
    ArrayList<Daily> daily
    ArrayList<Alerts> alerts


    static class Current{

        Integer dt
        Integer sunrise
        Integer sunset
        Double temp
        Double feels_like
        Integer pressure
        Integer humidity
        Double dew_point
        Integer uvi
        Integer clouds
        Integer visibility
        Double wind_speed
        Double wind_deg
        ArrayList<Weather> weather
    }

    static class Hourly{
        Integer dt
        Double temp
        Double feels_like
        Integer pressure
        Integer humidity
        Double dew_point
        Double uvi
        Integer clouds
        Integer visibility
        Double wind_speed
        Double wind_deg
        ArrayList<Weather> weather
        Double pop
        Rain rain
        Snow snow

        static class Rain{
            Double _1h
        }
        static class Snow{
            Double _1h
        }
    }

    static class Daily{
        Integer dt
        Integer sunrise
        Integer sunset
        Temp temp
        Feels_Like feels_like
        Integer pressure
        Integer humidity
        Double dew_point
        Double wind_speed
        Double wind_deg
        ArrayList<Weather> weather
        Integer clouds
        Double pop
        Double uvi
        Double rain
        Double snow

        static class Feels_Like{
            Double day
            Double night
            Double eve
            Double morn
        }

        static class Temp{
            Double day
            Double min
            Double max
            Double night
            Double eve
            Double morn
        }
    }

    static class Alerts{

        String sender_name
        String event
        Integer start
        Integer end
        String description
    }
}
