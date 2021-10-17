import { retrieveAllCountries } from '../adapters/WeatherCurrentService';
import i18n from 'i18next';

export const countriesActions = {
    getCountries,
};

function getCountries() {
    return async (dispatch) => {
        await retrieveAllCountries().then((response) =>
            dispatch({
                type: 'GET_COUNTRIES',
                countries: internationalizeCountries(response),
            })
        );
    };
}

const internationalizeCountries = (countries) => {
    return countries?.data?.map((country) => {
        return {
            countryName: i18n.t(
                'common.countryName.' + country.originalCountryName
            ),
            id: country.code,
            originalCountryName: country.originalCountryName,
        };
    });
};
