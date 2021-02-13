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
    if (convertTo === "celsius")
        return temp - 273.15
    else if (convertTo === "fahrenheit")
        return (temp -273.15) * 1.8 + 32
    else return temp
}