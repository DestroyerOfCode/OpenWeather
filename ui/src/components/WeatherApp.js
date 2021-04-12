import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import WeatherCurrentComponent from "./current/WeatherCurrent";
import { withTranslation } from "react-i18next";
import WeatherForecastComponent from "./forecast/daily/WeatherForecastDaily";
import { temperatureDropdownList } from "../buildingBlocks/commonBuildingBlocks";
import WeatherCurrentService from "../adapters/WeatherCurrentService";
import { nanoid } from "nanoid";

import i18n from "i18next";
import Button from "@material-ui/core/Button";

import "../i18n";

function WeatherApp(props) {
	const [temperature, setTemperature] = useState({
		units: "celsius",
		abbreviation: "°C",
	});

	return (
		<main className="container">
			<Button
				variant="outlined"
				onClick={() => i18n.changeLanguage("en")}
				size="small"
				disabled={i18n.language === "en"}
				color={i18n.language === "en" ? "default" : "primary"}
				value="en"
			>
				EN
			</Button>
			<Button
				variant="outlined"
				onClick={() => i18n.changeLanguage("sk")}
				size="small"
				disabled={i18n.language === "sk"}
				color={i18n.language === "sk" ? "default" : "primary"}
				value="sk"
			>
				SK
			</Button>
			<Button
				variant="outlined"
				onClick={() => i18n.changeLanguage("de")}
				size="small"
				disabled={i18n.language === "de"}
				color={i18n.language === "de" ? "default" : "primary"}
				value="de"
			>
				DE
			</Button>
			{temperatureDropdownList((units, abbreviation) => {
				setTemperature({ units: units, abbreviation: abbreviation });
			})}

			<Switch>
				<Route
					exact
					path="/"
					render={(props) => (
						<WeatherCurrentComponent {...props} temperature={temperature} />
					)}
				/>
				<Route
					path="/forecast"
					render={(props) => (
						<WeatherForecastComponent {...props} temperature={temperature} />
					)}
				/>
			</Switch>
		</main>
	);
}

export default withTranslation()(WeatherApp);
