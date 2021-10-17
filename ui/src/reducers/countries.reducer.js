import { countriesConstants } from '../_constants';

export function countries(state = [], action) {
    switch (action.type) {
        case countriesConstants.GET_COUNTRIES:
            return action.countries;
        default:
            return state;
    }
}
