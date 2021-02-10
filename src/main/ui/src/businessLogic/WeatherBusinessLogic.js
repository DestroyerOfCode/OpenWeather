import i18n from 'i18next'
export const getWeatherDescription = (weather) => {
    var weatherItemReduce = (prevVal, currVal, idx) => {
        return idx === 0 ? i18n.t(currVal.description) : prevVal + ", " + i18n.t(currVal.description);
    }
    return weather.weather.map((item) => ({"description" : "common.description." + i18n.t(item.description)})).reduce(weatherItemReduce, '')
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