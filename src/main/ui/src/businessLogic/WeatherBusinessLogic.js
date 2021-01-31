export const getWeatherDescription = (weather) => {
    var weatherItemReduce = (prevVal, currVal, idx) => {
        return idx === 0 ? currVal.description : prevVal + ", " + currVal.description;
    }

    return weather.weather.reduce(weatherItemReduce, '')
}

export const displayDateTime = (dateTime) => {
    return dateTime.toLocaleString("sk-SK")
}

export const convertTemperature = (convertTo, temp) => {
    // console.log("convertTo: " + convertTo)
    if (convertTo === "celsius")
        return temp - 273.15
    else if (convertTo === "fahrenheit")
        return (temp -273.15) * 1.8 + 32
    else return temp
}