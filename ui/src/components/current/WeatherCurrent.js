import React, { useState, useEffect} from "react";
import WeatherCurrentService from '../../adapters/WeatherCurrentService';
import { Link } from "react-router-dom";
import {getWeatherDescription, 
    convertTemperature,
    displayCoords
    } from '../../businessLogic/WeatherBusinessLogic';
import '../../styles/common/Header.scss';
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Button from '@material-ui/core/Button';

import i18n from 'i18next'

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

  export const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 12,
    },
  }))(TableCell);
  
  export const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

function WeatherCurrent(props) {
    const [currentWeathers, setCurrentWeathers] = useState({})
    const [isAscending, setIsAscending] = useState(true)
    const [sortBy, setSortBy] = useState('name')
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(100)
    const filtersSelector = useSelector(filters => filters)
    const classes = useStyles();

    useEffect(() => {
        refreshWeathers();
    }, [currentPage, itemsPerPage, sortBy, isAscending])
    
    const refreshWeathers = () => {
        WeatherCurrentService.retrieveAllWeathers(sortBy, isAscending, filtersSelector, currentPage, itemsPerPage)
            .then(response => {
                setCurrentWeathers(response.data)
            })
    }

    const headCells = () => { return ([
        {id: "name", label: i18n.t('current.header.cityName'), notNumeric: true, disablePadding: true},
        {id: "coord.lat", label: i18n.t("current.header.latitude"), notNumeric: false, disablePadding: true},
        {id: "coord.lon", label: i18n.t("current.header.longitude"), notNumeric: false, disablePadding: true},
        {id: "sys.countryName", label: i18n.t("current.header.country"), notNumeric: true, disablePadding: false},
        {id: "weatherMain.humidity", label: i18n.t("current.header.humidity"), notNumeric: false, disablePadding: true},
        {id: "weatherMain.feels_like", label: i18n.t("current.header.feelsLike"), notNumeric: false, disablePadding: false},
        {id: "weatherMain.temp", label: i18n.t("current.header.temperature"), notNumeric: false, disablePadding: true},
        {id: "weatherMain.temp_max", label: i18n.t("current.header.maximumTemperature"), notNumeric: false, disablePadding: false},
        {id: "weatherMain.temp_min", label: i18n.t("current.header.minimalTemperature"), notNumeric: false, disablePadding: false},
        {id: "weather.description", label: i18n.t("current.header.description"), notNumeric: true, disablePadding: true}
    ])
    }

    const EnhancedTableHead = (props) => {
        const { classes, order, orderBy, headCells} = props;
        console.log(headCells)
        return ( 
            <TableRow>
                {headCells.map((headCell) => {
                    return (<TableCell
                        key={headCell.id}
                        // align={headCell.notNumeric ? 'left' : 'right'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        padding='none'
                        onClick={() => changeOrder(headCell.id)}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => changeOrder(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                                {/* {order === 'desc' ? 'sorted descending' : 'sorted ascending'} */}
                            </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                    )
                })}
            </TableRow>
        )
    }
    
    const changeOrder = (val) => {
        console.log(val)
        setSortBy(val)
        setIsAscending(!isAscending)
    }

    const mainBody = () => {
    return currentWeathers.content?.length ? (
    <TableBody>
        {
            currentWeathers.content.map(
                weather => {
                    return ( 
                    <StyledTableRow  key={nanoid()}>
                        <StyledTableCell > <Link to={{pathname: "/forecast", state: {"lat": weather.coord.lat, "lon": weather.coord.lon} }}>{weather.name}</Link></StyledTableCell>
                        <StyledTableCell >{displayCoords(weather.coord.lat)}</StyledTableCell>
                        <StyledTableCell >{displayCoords(weather.coord.lon)}</StyledTableCell>
                        <StyledTableCell >{i18n.t(`common.countryName.${weather.sys.countryName}`)}</StyledTableCell>
                        <StyledTableCell >{weather.weatherMain.humidity}</StyledTableCell>
                        <StyledTableCell >{`${convertTemperature(props.temperature.units, weather.weatherMain.feels_like)?.toFixed(2)}${props.temperature.abbreviation}`}</StyledTableCell>
                        <StyledTableCell >{`${convertTemperature(props.temperature.units, weather.weatherMain.temp)?.toFixed(2)}${props.temperature.abbreviation}`}</StyledTableCell>
                        <StyledTableCell >{`${convertTemperature(props.temperature.units, weather.weatherMain.temp_max)?.toFixed(2)}${props.temperature.abbreviation}`}</StyledTableCell>
                        <StyledTableCell >{`${convertTemperature(props.temperature.units, weather.weatherMain.temp_min)?.toFixed(2)}${props.temperature.abbreviation}`}</StyledTableCell>
                        <StyledTableCell>{getWeatherDescription(weather)}</StyledTableCell>
                    </StyledTableRow>
                    )
                }
            )
        }
        </TableBody>
    ) : <TableBody></TableBody>
   }

   const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };
  const handleChangePage = (event, page) =>{ setCurrentPage(page)}
    return (
        <div className="container">
            <Button variant="contained" color="primary" onClick={refreshWeathers}>
                filter
            </Button>
            <TablePagination
                rowsPerPageOptions={[10, 100, 1000]}
                component="div"
                count={currentWeathers.totalElements}
                rowsPerPage={itemsPerPage}
                page={currentPage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <TableContainer key = {nanoid()} component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">

                <EnhancedTableHead 
                    classes={classes}
                    order={isAscending ? 'asc' : 'desc'}
                    orderBy={sortBy}
                    headCells={headCells.call()}
                />
                {mainBody()}
                </Table>
            </TableContainer>            
            
            
        </div>
    )
}
export default WeatherCurrent
