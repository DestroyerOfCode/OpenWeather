import { filtersConstants } from "../_constants";

export function filters(state = {}, action) {
	switch (action.type) {
		case filtersConstants.UPDATE_FILTERS:
			// if (
				// (((action.filterOperator === "$gte" ||
					// action.filterOperator === "$lte") &&
					// isNaN(action.value)) ||
					// "" === action.value ||
					// (Array.isArray(action.value) && action.value.length === 0)) &&
				// state[action.filterName] !== undefined
			// ) {
				// delete state[action.filterName][action.filterOperator];
				// console.log(Object.keys(state[action.filterName]).length);
				// if (Object.keys(state[action.filterName]).length === 0)
					// delete state[action.filterName];
				// return {filters: state};
			// }
			// if (state[action.filterName]) {
				// let temp = state[action.filterName];
				// temp[action.filterOperator] = action.value;
				// state = { ...state, [action.filterName]: temp };
				// return {filters: state}
			// }
			// if (
				// ((action.filterOperator === "$gte" ||
					// action.filterOperator === "$lte") &&
					// !isNaN(action.value)) ||
				// "" !== action.value ||
				// (Array.isArray(action.value) && action.value.length !== 0)
			// ) {
					// state = {...state, [action.filterName]: { [action.filterOperator]: action.value }}
				// return {filters: state}
			// }
			return action.filters;
		default:
			return state;
	}
}

// export default reducer;
