import { filtersConstants } from "../_constants";

export function filters(state = {}, action) {
	switch (action.type) {
		case filtersConstants.UPDATE_FILTERS:
			return action.filters;
		default:
			return state;
	}
}
