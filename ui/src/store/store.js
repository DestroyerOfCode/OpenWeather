function reducer(filters = {}, action) {
	switch (action.type) {
		case "UPDATE_FILTERS":
			if (
				(((action.filterOperator === "$gte" ||
					action.filterOperator === "$lte") &&
					isNaN(action.value)) ||
					"" === action.value ||
					(Array.isArray(action.value) && action.value.length === 0)) &&
				filters[action.filterName] !== undefined
			) {
				delete filters[action.filterName][action.filterOperator];
				console.log(Object.keys(filters[action.filterName]).length);
				if (Object.keys(filters[action.filterName]).length === 0)
					delete filters[action.filterName];
				return filters;
			}
			if (filters[action.filterName]) {
				let temp = filters[action.filterName];
				temp[action.filterOperator] = action.value;
				return { ...filters, [action.filterName]: temp };
			}
			if (
				((action.filterOperator === "$gte" ||
					action.filterOperator === "$lte") &&
					!isNaN(action.value)) ||
				"" !== action.value ||
				(Array.isArray(action.value) && action.value.length !== 0)
			) {
				return {
					...filters,
					[action.filterName]: { [action.filterOperator]: action.value },
				};
			}
			return filters;
		default:
			return filters;
	}
}

export default reducer;
