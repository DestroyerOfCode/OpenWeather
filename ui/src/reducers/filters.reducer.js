import { filtersConstants } from '../_constants';

export function filters(state = {}, action) {
    switch (action.type) {
        case filtersConstants.UPDATE_FILTERS:
            return action.filters;
        case filtersConstants.CLEAR_FILTERS:
            return {};
        case filtersConstants.REMOVE_FILTER:
            delete action.filters[action.filterName][action.filterOperator];
            console.log(Object.keys(action.filters[action.filterName]).length);

            if (Object.keys(action.filters[action.filterName]).length === 0)
                delete action.filters[action.filterName];

            // I must assign to new object cause react thinks its the same object when deleting
            let newFilters = {};
            Object.assign(newFilters, action.filters);

            return newFilters;
        case filtersConstants.APPEND_FILTER:
            return {
                ...action.filters,
                [action.filterName]: { [action.filterOperator]: action.value },
            };
        case filtersConstants.APPEND_FILTER_OPERATOR:
            let temp = action.filters[action.filterName];
            temp[action.filterOperator] = action.value;
            // action.filters= { ...action.filters, [action.filterName]: temp };
            return { ...action.filters, [action.filterName]: temp };
        default:
            return state;
    }
}
