import React, { useState, useEffect, useContext } from 'react';
import { getDailyForecastByCityName } from '../../../adapters/WeatherForecastService';
import i18n from 'i18next';
import '../../../i18n';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { nanoid } from 'nanoid';
import Button from '@material-ui/core/Button';
import TemperatureCtx from '../../../buildingBlocks/Temperature';
import CustomCircularLoader from '../../../buildingBlocks/CustomCircularLoader';
import EnhancedTableHeader from '../../common/EnhancedTableHeader';
import WeatherForecastTableBody from './WeatherForecastTableBody';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

function WeatherForecastComponent(props) {
    const [dailyWeatherForecast, setDailyWeatherForecast] = useState({});
    const [isAscending, setIsAscending] = useState(true);
    const [sortBy, setSortBy] = useState('sunrise');
    const [loading, setLoading] = useState(true);
    const temperature = useContext(TemperatureCtx);

    const classes = useStyles();

    useEffect(() => {
        getDailyForecastByCityName(
            props.history.location.state.lat,
            props.history.location.state.lon,
            'Current,Hourly,Minutely'
        ).then((response) => {
            setDailyWeatherForecast(response.data);
            setLoading(false);
        });
    }, []);

    const changeOrder = (val) => {
        setSortBy(val);
        setIsAscending(!isAscending);
    };

    return loading ? (
        <CustomCircularLoader />
    ) : (
        <>
            <Link to={{ pathname: '/' }}>
                <Button variant="contained" color="primary">
                    {i18n.t('forecast.currentWeather')}
                </Button>
            </Link>

            <TableContainer key={nanoid()} component={Paper}>
                <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                >
                    <EnhancedTableHeader
                        classes={classes}
                        order={isAscending ? 'asc' : 'desc'}
                        orderBy={sortBy}
                        headCells={headCells.call()}
                        changeOrder={changeOrder}
                    />
                    <WeatherForecastTableBody
                        rows={dailyWeatherForecast.daily}
                        temperature={temperature}
                        order={isAscending ? 'asc' : 'desc'}
                        orderBy={sortBy}
                    />
                </Table>
            </TableContainer>
        </>
    );
}

const headCells = () => {
    return [
        {
            id: 'sunrise',
            label: i18n.t('forecast.header.sunrise'),
            notNumeric: true,
            disablePadding: true,
        },
        {
            id: 'sunset',
            label: i18n.t('forecast.header.sunset'),
            notNumeric: false,
            disablePadding: true,
        },
        {
            id: 'temp.day',
            label: i18n.t('forecast.header.temp'),
            notNumeric: false,
            disablePadding: true,
        },
        {
            id: 'temp.min',
            label: i18n.t('forecast.header.min'),
            notNumeric: true,
            disablePadding: false,
        },
        {
            id: 'temp.max',
            label: i18n.t('forecast.header.max'),
            notNumeric: false,
            disablePadding: true,
        },
        {
            id: 'temp.night',
            label: i18n.t('forecast.header.night'),
            notNumeric: false,
            disablePadding: false,
        },
        {
            id: 'temp.evening',
            label: i18n.t('forecast.header.evening'),
            notNumeric: false,
            disablePadding: true,
        },
        {
            id: 'temp.morning',
            label: i18n.t('forecast.header.morning'),
            notNumeric: false,
            disablePadding: false,
        },
        {
            id: 'feels_like.day',
            label: i18n.t('forecast.header.feelsLikeDay'),
            notNumeric: false,
            disablePadding: false,
        },
        {
            id: 'feels_like.night',
            label: i18n.t('forecast.header.feelsLikeNight'),
            notNumeric: true,
            disablePadding: true,
        },
        {
            id: 'feels_like.evening',
            label: i18n.t('forecast.header.feelsLikeEvening'),
            notNumeric: true,
            disablePadding: true,
        },
        {
            id: 'feels_like.morning',
            label: i18n.t('forecast.header.feelsLikeMorning'),
            notNumeric: true,
            disablePadding: true,
        },
        {
            id: 'wind_speed',
            label: i18n.t('forecast.header.windSpeed'),
            notNumeric: true,
            disablePadding: true,
        },
        {
            id: 'wind_deg',
            label: i18n.t('forecast.header.windDeg'),
            notNumeric: true,
            disablePadding: true,
        },
        {
            id: 'weather.description',
            label: i18n.t('forecast.header.description'),
            notNumeric: true,
            disablePadding: true,
        },
    ];
};

export default WeatherForecastComponent;
