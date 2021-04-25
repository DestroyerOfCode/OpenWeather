import {
    getWeatherDescription,
    displayDateTime,
    convertTemperature,
} from '../../../businessLogic/WeatherBusinessLogic';
import TableBody from '@material-ui/core/TableBody';
import {
    StyledTableCell,
    StyledTableRow,
} from '../../current/WeatherCurrentTableBody';

function WeatherForecastTableBody(props) {
    const { rows, temperature, order, orderBy } = props;
    return (
        <TableBody>
            {stableSort(rows, getComparator(order, orderBy))?.map(
                (dailyWeather) => {
                    return (
                        <StyledTableRow key={dailyWeather.dt}>
                            <StyledTableCell id="sunrise">
                                {displayDateTime(
                                    new Date(dailyWeather.sunrise * 1000)
                                )}
                            </StyledTableCell>
                            <StyledTableCell id="sunset">
                                {displayDateTime(
                                    new Date(dailyWeather.sunset * 1000)
                                )}
                            </StyledTableCell>
                            <StyledTableCell id="temp.day">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.temp.day
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="temp.min">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.temp.min
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="temp.max">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.temp.max
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="temp.night">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.temp.night
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="temp.evening">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.temp.eve
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="temp.morning">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.temp.morn
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="feels_like.day">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.feels_like.day
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="feels_like.night">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.feels_like.night
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="feels_like.evening">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.feels_like.eve
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="feels_like.morning">{`${convertTemperature(
                                temperature.units,
                                dailyWeather.feels_like.morn
                            ).toFixed(2)}${
                                temperature.abbreviation
                            }`}</StyledTableCell>
                            <StyledTableCell id="wind_speed">
                                {dailyWeather.wind_speed}
                            </StyledTableCell>
                            <StyledTableCell id="wind_deg">
                                {dailyWeather.wind_deg}
                            </StyledTableCell>
                            <StyledTableCell id="weather.description">
                                {getWeatherDescription(dailyWeather)}
                            </StyledTableCell>
                        </StyledTableRow>
                    );
                }
            )}
        </TableBody>
    );
}

function descendingComparator(a, b, orderBy) {
    if (orderBy.includes('temp')) {
        if (
            b['temp'][orderBy.replace('temp.', '')] <
            a['temp'][orderBy.replace('temp.', '')]
        ) {
            return -1;
        }
        if (
            b['temp'][orderBy.replace('temp.', '')] >
            a['temp'][orderBy.replace('temp.', '')]
        ) {
            return 1;
        }
    }
    if (orderBy.includes('feels_like')) {
        if (
            b['feels_like'][orderBy.replace('feels_like.', '')] <
            a['feels_like'][orderBy.replace('feels_like.', '')]
        ) {
            return -1;
        }
        if (
            b['feels_like'][orderBy.replace('feels_like.', '')] >
            a['feels_like'][orderBy.replace('feels_like.', '')]
        ) {
            return 1;
        }
    }

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default WeatherForecastTableBody;
