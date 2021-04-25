import { retrieveAllDescriptions } from '../adapters/WeatherCurrentService';
import i18n from 'i18next';

export const descriptionsActions = {
    getDescriptions,
};

const internationalizeDescriptions = (descriptions) => {
    return descriptions?.data?.map((description) => ({
        name: i18n.t('common.description.' + description.originalValue),
        id: description.id,
        originalValue: description.originalValue,
    }));
};

function getDescriptions() {
    return async (dispatch) => {
        await retrieveAllDescriptions().then((response) => {
            console.log(response);
            dispatch({
                type: 'GET_DESCRIPTIONS',
                descriptions: internationalizeDescriptions(response),
            });
        });
    };
}
