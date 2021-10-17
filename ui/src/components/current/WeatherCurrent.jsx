import React, { useState, useEffect, useContext } from 'react';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import FiltersComponent from './Filters';
import i18n from 'i18next';
import TemperatureCtx from '../../buildingBlocks/Temperature';
import CustomCircularLoader from '../../buildingBlocks/CustomCircularLoader';
import EnhancedTableHead from '../common/EnhancedTableHeader';
import EnhancedTableBody from './WeatherCurrentTableBody';
import { weatherCurrentActions } from '../../actions';
const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxHeight: 500,
        position: 'sticky',
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
        width: 1000,
    },
}));

function WeatherCurrent(props) {
    const [isAscending, setIsAscending] = useState(true);
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [loading, setLoading] = useState(true);
    const filtersSelector = useSelector((state) => state.filters);
    const currentWeathers = useSelector((state) => state.weatherCurrent);
    const classes = useStyles();
    const dispatch = useDispatch();
    const temperature = useContext(TemperatureCtx);

    useEffect(() => {
        refreshWeathers();
    }, [
        props,
        currentPage,
        itemsPerPage,
        sortBy,
        isAscending,
        filtersSelector,
    ]);

    const refreshWeathers = () => {
        dispatch(
            weatherCurrentActions.getCurrentWeathers(
                sortBy,
                isAscending,
                filtersSelector,
                currentPage,
                itemsPerPage
            )
        );
        setLoading(false);
    };

    const headCells = () => {
        return [
            {
                id: 'name',
                label: i18n.t('current.header.cityName'),
                notNumeric: true,
                disablePadding: true,
            },
            {
                id: 'coord.lat',
                label: i18n.t('current.header.latitude'),
                notNumeric: false,
                disablePadding: true,
            },
            {
                id: 'coord.lon',
                label: i18n.t('current.header.longitude'),
                notNumeric: false,
                disablePadding: true,
            },
            {
                id: 'sys.countryName',
                label: i18n.t('current.header.country'),
                notNumeric: true,
                disablePadding: false,
            },
            {
                id: 'weatherMain.humidity',
                label: i18n.t('current.header.humidity'),
                notNumeric: false,
                disablePadding: true,
            },
            {
                id: 'weatherMain.feels_like',
                label: i18n.t('current.header.feelsLike'),
                notNumeric: false,
                disablePadding: false,
            },
            {
                id: 'weatherMain.temp',
                label: i18n.t('current.header.temperature'),
                notNumeric: false,
                disablePadding: true,
            },
            {
                id: 'weatherMain.temp_max',
                label: i18n.t('current.header.maximumTemperature'),
                notNumeric: false,
                disablePadding: false,
            },
            {
                id: 'weatherMain.temp_min',
                label: i18n.t('current.header.minimalTemperature'),
                notNumeric: false,
                disablePadding: false,
            },
            {
                id: 'weather.description',
                label: i18n.t('current.header.description'),
                notNumeric: true,
                disablePadding: true,
            },
        ];
    };

    const changeOrder = (val) => {
        setSortBy(val);
        setIsAscending(!isAscending);
    };

    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };
    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    return loading ? (
        <CustomCircularLoader />
    ) : (
        <div className="container">
            <FiltersComponent
                key={nanoid()}
                temperatureUnits={temperature.units}
                temperature={temperature.abbreviation}
                handleChangePage={handleChangePage}
            />

            <TablePagination
                rowsPerPageOptions={[
                    { label: i18n.t('page.ten'), value: 10 },
                    { label: i18n.t('page.hundred'), value: 100 },
                    { label: i18n.t('page.thousand'), value: 1000 },
                ]}
                component="div"
                count={currentWeathers?.totalElements}
                rowsPerPage={itemsPerPage}
                page={currentPage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                backIconButtonText={i18n.t('page.previous')}
                nextIconButtonText={i18n.t('page.next')}
                labelRowsPerPage={i18n.t('page.rows')}
            />

            <TableContainer
                key={nanoid()}
                component={Paper}
                className={classes.tableContainer}
            >
                <Table
                    stickyHeader={true}
                    size="small"
                    aria-label="a dense table"
                >
                    <EnhancedTableHead
                        stickyHeader
                        classes={classes}
                        order={isAscending ? 'asc' : 'desc'}
                        orderBy={sortBy}
                        changeOrder={changeOrder}
                        headCells={headCells.call()}
                    />
                    <EnhancedTableBody
                        currentWeathers={currentWeathers}
                        temperature={temperature}
                    />
                </Table>
            </TableContainer>
        </div>
    );
}
export default WeatherCurrent;
