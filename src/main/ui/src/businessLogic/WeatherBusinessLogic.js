    export const getWeatherDescription = (weather) => {
        var weatherItemReduce = (prevVal, currVal, idx) => {
            return idx === 0 ? currVal.description : prevVal + ", " + currVal.description;
        }

        return weather.weather.reduce(weatherItemReduce, '')
    }

    export const convertTemperature = (convertFrom, convertTo, temp) => {
        if (convertFrom === 'kelvin' && convertTo === "celsius")
            return temp - 273.15
        else if (convertFrom === 'kelvin' && convertTo === "fahrenheit")
            return (temp -32) * 1.8 + 273.15
        else if (convertFrom === 'celsius' && convertTo === "kelvin" )
            return  temp + 273.15
        else if (convertFrom === 'celsius' && convertTo === "fahrenheit")
            return temp * 1.8 + 32
        else if (convertFrom === "fahrenheit" && convertTo === "kelvin")
            return temp - 32 * 1.8 + 273.15
        else if (convertFrom === "fahrenheit" && convertTo === "celsius")
            return ( temp - 30 )/2
        throw new Error("Invalid converting units")
    }