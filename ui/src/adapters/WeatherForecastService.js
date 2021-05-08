import axios from 'axios';
import { apiConstants } from '../_constants';

export function getDailyForecastByCityName(lat, lon, excludedForecasts) {
    const coordinates = `{"lat":${lat},"lon":${lon}}`;
    const params = { lat, lon, excludedForecasts: excludedForecasts };

    return axios.get(`${apiConstants.WEATHER_FORECAST_API_URL}/daily`, {
        params,
    });
}
