function reducer(filters = {}, action) {
    switch (action.type) {
        case "UPDATE_FILTERS":
            console.log(action)
            if(
                (((action.filterOperator === "$gte" || action.filterOperator === "$lte") && isNaN(action.value)) || 
                '' === action.value ||
                (Array.isArray(action.value) && action.value.length === 0)) &&
                filters[action.filterName] !== undefined
            ){
                delete filters[action.filterName][action.filterOperator]
                console.log(Object.keys(filters[action.filterName]).length)
                if (Object.keys(filters[action.filterName]).length === 0)
                    delete filters[action.filterName]
                return filters
            }
            if (filters[action.filterName]){
                console.log("tu")
                let temp = filters[action.filterName]
                temp[action.filterOperator] = action.value
                return {...filters, [action.filterName]: temp}
            }
            if(
                (((action.filterOperator === "$gte" || action.filterOperator === "$lte") && !isNaN(action.value)) || 
                '' !== action.value ||
                (Array.isArray(action.value) && action.value.length !== 0))
            ){
                console.log("v 3tom")
                return {...filters, [action.filterName]: {[action.filterOperator] : action.value}}
            }
                console.log(filters)
            return filters;
        case "CHANGE_SORTING_VALUE_CURRENT_WEATHER":
            return action.sortBy
        default:
            return filters;
    }
  }
  
  export default reducer;