const COURSE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const apiConstants = {
    WEATHER_FORECAST_API_URL: `${COURSE_API_URL}/weather/forecast`,
    WEATHER_CURRENT_API_URL: `${COURSE_API_URL}/weather/current`,
};
