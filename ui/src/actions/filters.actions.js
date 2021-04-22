import { filtersConstants } from '../_constants'
export const filtersActions = {
    update
};

function update(filterName, filterOperator, value, filters){
    return ( dispatch) => {
        let a =3;
        if (
        (((filterOperator === "$gte" ||
            filterOperator === "$lte") &&
            isNaN(value)) ||
            "" === value ||
            (Array.isArray(value) && value.length === 0)) &&
        filters[filterName] !== undefined
        ) {
            delete filters[filterName][filterOperator];
            console.log(Object.keys(filters[filterName]).length);
            if (Object.keys(filters[filterName]).length === 0)
                delete filters[filterName];
            filters= filters;
        }

        else if (filters[filterName]) {
            let temp = filters[filterName];
            temp[filterOperator] = value;
            filters= { ...filters, [filterName]: temp };
        }

        else if (
            ((filterOperator === "$gte" ||
                filterOperator === "$lte") &&
                !isNaN(value)) ||
            "" !== value ||
            (Array.isArray(value) && value.length !== 0)
        ) {
            filters= {
                ...filters,
                [filterName]: { [filterOperator]: value },
            };
        }
        dispatch({type: "UPDATE_FILTERS", filters});
    }
    
}