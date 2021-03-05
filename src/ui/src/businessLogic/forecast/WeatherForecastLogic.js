export const getWeatherMain = (weather) => {
    var weatherItemReduce = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.main : prevVal + ", " + currVal.main;
    }

    return weather.weather.reduce(weatherItemReduce, '')
}
export const getWeatherId = (weather) => {
    var weatherItemReduce = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.id : prevVal + ", " + currVal.id;
    }

    return weather.weather.reduce(weatherItemReduce, '')
}

export const getWeatherIcon = (weather) => {
    var weatherItemReduce = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.icon : prevVal + ", " + currVal.icon;
    }

    return weather.weather.reduce(weatherItemReduce, '')
}