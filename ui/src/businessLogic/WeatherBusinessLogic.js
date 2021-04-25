import i18n from 'i18next';
export const getWeatherDescription = (weather) => {
    var weatherItemReduce = (prevVal, currVal, idx) => {
        return idx === 0
            ? i18n.t(`common.description.${currVal.description}`)
            : `${prevVal}` +
                  ', ' +
                  i18n.t(`common.description.${currVal.description}`);
    };
    return weather.weather.reduce(weatherItemReduce, '');
};

export const displayDateTime = (dateTime) => {
    return dateTime.toLocaleString('sk-SK');
};

export const convertTemperature = (convertTo, temp) => {
    if (!temp) return '';
    if (convertTo === 'celsius')
        return typeof temp === 'string'
            ? parseFloat(temp - 273.15).toFixed(2)
            : parseFloat((temp - 273.15).toFixed(2));
    else if (convertTo === 'fahrenheit')
        return typeof temp === 'string'
            ? parseFloat((temp - 273.15) * 1.8 + 32).toFixed(2)
            : parseFloat(((temp - 273.15) * 1.8 + 32).toFixed(2));
    else
        return typeof temp === 'string'
            ? parseFloat(temp).toFixed(2)
            : parseFloat(temp.toFixed(2));
};

export const displayCoords = (coord) => {
    return typeof coord === 'string'
        ? parseFloat(coord).toFixed(2)
        : coord.toFixed(2);
};
