import axios from 'axios';
import { apiConstants } from '../_constants';

export function retrieveAllWeathers(
    sortBy,
    isAscending,
    filters,
    currentPage,
    itemsPerPage
) {
    return axios.post(
        `${apiConstants.WEATHER_CURRENT_API_URL}/retrieve/fromDb`,
        {
            sortBy: sortBy,
            isAscending: isAscending,
            filters,
            itemsPerPage: itemsPerPage,
            pageNumber: currentPage,
        }
    );
}

export function retrieveAllCountries() {
    return axios.get(`${apiConstants.WEATHER_CURRENT_API_URL}/countries`);
}

export function retrieveAllDescriptions() {
    return axios.get(`${apiConstants.WEATHER_CURRENT_API_URL}/descriptions`);
}
