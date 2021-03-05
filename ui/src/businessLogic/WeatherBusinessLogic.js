import i18n from 'i18next'
export const getWeatherDescription = (weather) => {
    var weatherItemReduce = (prevVal, currVal, idx) => {
        // console.log("currVal.description: " + currVal.description)
        return idx === 0 ? i18n.t(`common.description.${currVal.description}`) : (`${prevVal}`) + ", " + i18n.t(`common.description.${currVal.description}`);
    }
    return weather.weather.reduce(weatherItemReduce, '')
}

export const displayDateTime = (dateTime) => {
    return dateTime.toLocaleString("sk-SK")
}

export const convertTemperature = (convertTo, temp) => {
    // console.log(convertTo)
    if (convertTo === "celsius")
        return typeof temp === 'string' ? parseFloat(temp - 273.15) : temp - 273.15
    else if (convertTo === "fahrenheit")
        return typeof temp === 'string' ? parseFloat((temp -273.15) * 1.8 + 32) : (temp -273.15) * 1.8 + 32
    else return typeof temp === 'string' ? parseFloat(temp ) : temp
}


export const keyExistsInArr = (arr, key) => {
    let exists = false
    if (!Array.isArray(key)){
        arr?.some(item => {
            if(item.hasOwnProperty([key])) {
                exists = true;
                return true
            }
            else return false
        })
    }
    //since countries and descriptions is a multicheckbox, they are arrays and it has multiple keys and must check not with equals
    else{
        arr?.some(item => {
            if(item.includes([key])) {
                exists = true;
                return true
            }
            else return false
        })
    }
    return exists
}

export const findIndexInFilters = (filters, key) => {
    let indexOfKey = 0
    filters?.some((filterName, index, filters) => {
        if(filterName.hasOwnProperty([key])){ 
            indexOfKey = index
            return indexOfKey
        }
        else return false
    })
    return indexOfKey
}

export const changeFilters = (index, filterName, filterOperator, filters)  => {

    if (filters[index][filterName][filterOperator])
        delete filters[index][filterName][filterOperator]  
    if (Object.keys(filters[index][filterName]).length === 0)
        filters.splice(index, 1)
    return filters
}

export const addFilterOperatorToExistingFilterName = (event, filterName, filterOperator, filters) => {
    filters.forEach((item, index, filters) => {
        if (item.hasOwnProperty([filterName])){
            filters[index][filterName][filterOperator] = event
        }
    })
    return filters
}

export const isAdditionalFilterCheck = (event, index, filterName, filters) => {
    if (isNotAdditionalFilterWithContains(event) === false)
        return false
    if (isSameFilterChanged( index, filterName, filters ) === false)
        return false
    return true
            
}   

//if there are multiple countries and descriptions, backend must make a new query
//since no additional filter is added, only value. I am unable to send query request
//with an array element
export const isNotAdditionalFilterWithContains = (event) => {
   return event.includes(",") ? false : true
}

// this check is here for times when I change the same filter multiple
// times in a row and the filter is same. If it is the same I cant filter
// from memory because I could not load some weathers
export const isSameFilterChanged = (index, filterName, filters ) => {
   return filterName === filters[index][filterName]
}

export const  displayCoords = (coord) => {
    return typeof coord === 'string' ? parseFloat(coord).toFixed(2) :  coord.toFixed(2)
}