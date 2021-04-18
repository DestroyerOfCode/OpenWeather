import React, { useState, useEffect, useContext } from "react";
import WeatherForecastService from "../../../adapters/WeatherForecastService";
import {
	getWeatherDescription,
	displayDateTime,
	convertTemperature,
} from "../../../businessLogic/WeatherBusinessLogic";
import i18n from "i18next";
import "../../../i18n";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { StyledTableCell, StyledTableRow } from "../../current/WeatherCurrent";
import { makeStyles } from "@material-ui/core/styles";
import { nanoid } from "nanoid";
import Button from "@material-ui/core/Button";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TemperatureCtx from '../../../buildingBlocks/Temperature'
import { customCircularLoader } from '../../../buildingBlocks/commonBuildingBlocks'

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 650,
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
}));

function WeatherForecastComponent(props) {
	const [dailyWeatherForecast, setDailyWeatherForecast] = useState({});
	const [isAscending, setIsAscending] = useState(true);
	const [sortBy, setSortBy] = useState("sunrise");
	const temperature = useContext(TemperatureCtx)

	const classes = useStyles();

	useEffect(() => {
		if (dailyWeatherForecast.daily === undefined)
			WeatherForecastService.getDailyForecastByCityName(
				props.history.location.state.lat,
				props.history.location.state.lon,
				"Current,Hourly,Minutely"
			).then((response) => setDailyWeatherForecast(response.data));
	}, [
		isAscending,
		sortBy,
		props.history.location.state.lat,
		props.history.location.state.lon,
	]);

	const EnhancedTableHead = (props) => {
		const { classes, order, orderBy, headCells } = props;
		return (
			<TableRow>
				{headCells.map((headCell) => {
					return (
						<TableCell
							key={headCell.id}
							// align={headCell.notNumeric ? 'left' : 'right'}
							sortDirection={orderBy === headCell.id ? order : false}
							padding="none"
							onClick={(event) => changeOrder(event, headCell.id)}
						>
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : "asc"}
								onClick={(event) => changeOrder(event, headCell.id)}
							>
								{headCell.label}
								{orderBy === headCell.id ? (
									<span className={classes.visuallyHidden}>
										{/* {order === 'desc' ? 'sorted descending' : 'sorted ascending'} */}
									</span>
								) : null}
							</TableSortLabel>
						</TableCell>
					);
				})}
			</TableRow>
		);
	};

	const changeOrder = (event, val) => {
		setSortBy(val);
		setIsAscending(!isAscending);
	};

	return dailyWeatherForecast.daily === undefined ? customCircularLoader() :  (
		<div>
			<Link to={{ pathname: "/" }}>
				<Button variant="contained" color="primary">
					{i18n.t("forecast.currentWeather")}
				</Button>
			</Link>

			<TableContainer key={nanoid()} component={Paper}>
				<Table
					className={classes.table}
					size="small"
					aria-label="a dense table"
				>
					<EnhancedTableHead
						classes={classes}
						order={isAscending ? "asc" : "desc"}
						orderBy={sortBy}
						headCells={headCells.call()}
						setSortBy={setSortBy}
						setIsAscending={setIsAscending}
					/>
					{createMainBody(
						dailyWeatherForecast,
						temperature,
						isAscending === true ? "asc" : "desc",
						sortBy
					)}
				</Table>
			</TableContainer>
		</div>
	);
}

const createMainBody = (dailyWeatherForecast, temperature, order, orderBy) => {
	function descendingComparator(a, b, orderBy) {
		if (orderBy.includes("temp")) {
			if (
				b["temp"][orderBy.replace("temp.", "")] <
				a["temp"][orderBy.replace("temp.", "")]
			) {
				return -1;
			}
			if (
				b["temp"][orderBy.replace("temp.", "")] >
				a["temp"][orderBy.replace("temp.", "")]
			) {
				return 1;
			}
		}
		if (orderBy.includes("feels_like")) {
			if (
				b["feels_like"][orderBy.replace("feels_like.", "")] <
				a["feels_like"][orderBy.replace("feels_like.", "")]
			) {
				return -1;
			}
			if (
				b["feels_like"][orderBy.replace("feels_like.", "")] >
				a["feels_like"][orderBy.replace("feels_like.", "")]
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
		return order === "desc"
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
	if (dailyWeatherForecast.daily === undefined) return <TableBody />;
	return (
		<TableBody>
			{stableSort(
				dailyWeatherForecast?.daily,
				getComparator(order, orderBy)
			)?.map((dailyWeather) => {
				return (
					<StyledTableRow key={dailyWeather.dt}>
						<StyledTableCell id="sunrise">
							{displayDateTime(new Date(dailyWeather.sunrise * 1000))}
						</StyledTableCell>
						<StyledTableCell id="sunset">
							{displayDateTime(new Date(dailyWeather.sunset * 1000))}
						</StyledTableCell>
						<StyledTableCell id="temp.day">{`${convertTemperature(
							temperature.units,
							dailyWeather.temp.day
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="temp.min">{`${convertTemperature(
							temperature.units,
							dailyWeather.temp.min
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="temp.max">{`${convertTemperature(
							temperature.units,
							dailyWeather.temp.max
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="temp.night">{`${convertTemperature(
							temperature.units,
							dailyWeather.temp.night
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="temp.evening">{`${convertTemperature(
							temperature.units,
							dailyWeather.temp.eve
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="temp.morning">{`${convertTemperature(
							temperature.units,
							dailyWeather.temp.morn
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="feels_like.day">{`${convertTemperature(
							temperature.units,
							dailyWeather.feels_like.day
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="feels_like.night">{`${convertTemperature(
							temperature.units,
							dailyWeather.feels_like.night
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="feels_like.evening">{`${convertTemperature(
							temperature.units,
							dailyWeather.feels_like.eve
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
						<StyledTableCell id="feels_like.morning">{`${convertTemperature(
							temperature.units,
							dailyWeather.feels_like.morn
						).toFixed(2)}${temperature.abbreviation}`}</StyledTableCell>
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
			})}
		</TableBody>
	);
};

const headCells = () => {
	return [
		{
			id: "sunrise",
			label: i18n.t("forecast.header.sunrise"),
			notNumeric: true,
			disablePadding: true,
		},
		{
			id: "sunset",
			label: i18n.t("forecast.header.sunset"),
			notNumeric: false,
			disablePadding: true,
		},
		{
			id: "temp.day",
			label: i18n.t("forecast.header.temp"),
			notNumeric: false,
			disablePadding: true,
		},
		{
			id: "temp.min",
			label: i18n.t("forecast.header.min"),
			notNumeric: true,
			disablePadding: false,
		},
		{
			id: "temp.max",
			label: i18n.t("forecast.header.max"),
			notNumeric: false,
			disablePadding: true,
		},
		{
			id: "temp.night",
			label: i18n.t("forecast.header.night"),
			notNumeric: false,
			disablePadding: false,
		},
		{
			id: "temp.evening",
			label: i18n.t("forecast.header.evening"),
			notNumeric: false,
			disablePadding: true,
		},
		{
			id: "temp.morning",
			label: i18n.t("forecast.header.morning"),
			notNumeric: false,
			disablePadding: false,
		},
		{
			id: "feels_like.day",
			label: i18n.t("forecast.header.feelsLikeDay"),
			notNumeric: false,
			disablePadding: false,
		},
		{
			id: "feels_like.night",
			label: i18n.t("forecast.header.feelsLikeNight"),
			notNumeric: true,
			disablePadding: true,
		},
		{
			id: "feels_like.evening",
			label: i18n.t("forecast.header.feelsLikeEvening"),
			notNumeric: true,
			disablePadding: true,
		},
		{
			id: "feels_like.morning",
			label: i18n.t("forecast.header.feelsLikeMorning"),
			notNumeric: true,
			disablePadding: true,
		},
		{
			id: "wind_speed",
			label: i18n.t("forecast.header.windSpeed"),
			notNumeric: true,
			disablePadding: true,
		},
		{
			id: "wind_deg",
			label: i18n.t("forecast.header.windDeg"),
			notNumeric: true,
			disablePadding: true,
		},
		{
			id: "weather.description",
			label: i18n.t("forecast.header.description"),
			notNumeric: true,
			disablePadding: true,
		},
	];
};
export default WeatherForecastComponent;
