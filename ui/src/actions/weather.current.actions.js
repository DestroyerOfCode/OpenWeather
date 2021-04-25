import { retrieveAllWeathers } from '../adapters/WeatherCurrentService';
import { weatherCurrentConstants } from '../_constants';
export const weatherCurrentActions = {
    getCurrentWeathers,
};

function getCurrentWeathers(
    sortBy,
    isAscending,
    filtersSelector,
    currentPage,
    itemsPerPage
) {
    return (dispatch) => {
        retrieveAllWeathers(
            sortBy,
            isAscending,
            filtersSelector,
            currentPage,
            itemsPerPage
        ).then((response) =>
            dispatch({
                type: weatherCurrentConstants.GET_CURRENT_WEATHERS,
                currentWeathers: response.data,
            })
        );
    };
}
