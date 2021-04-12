import React, { Component } from "react";
import "./App.css";
import WeatherApp from "./components/WeatherApp";
import { HashRouter } from "react-router-dom";
import "./i18n";
import { Suspense } from "react";
import { customCircularLoader } from './buildingBlocks/commonBuildingBlocks'

class App extends Component {
	render() {
		return (
			<React.StrictMode>
				<Suspense fallback={customCircularLoader()}>
					<HashRouter key="hashRouter">
						<WeatherApp />
					</HashRouter>
				</Suspense>
			</React.StrictMode>
		);
	}
}

export default App;
