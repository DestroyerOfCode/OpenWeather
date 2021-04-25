import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import WeatherCurrentComponent from './current/WeatherCurrent';
import { withTranslation } from 'react-i18next';
import WeatherForecastComponent from './forecast/daily/WeatherForecastDaily';
// import { temperatureDropdownList } from "../buildingBlocks/commonBuildingBlocks";
import { TemperatureDropdownList } from '../buildingBlocks/Temperature';
import TemperatureCtx from '../buildingBlocks/Temperature';
import i18n from 'i18next';
import Button from '@material-ui/core/Button';

import '../i18n';

function WeatherApp() {
    const [temperature, setTemperature] = useState({
        units: 'celsius',
        abbreviation: '°C',
    });

    return (
        <main className="container">
            <Button
                variant="outlined"
                onClick={() => i18n.changeLanguage('en')}
                size="small"
                disabled={i18n.language === 'en'}
                color={i18n.language === 'en' ? 'default' : 'primary'}
                value="en"
            >
                EN
            </Button>
            <Button
                variant="outlined"
                onClick={() => i18n.changeLanguage('sk')}
                size="small"
                disabled={i18n.language === 'sk'}
                color={i18n.language === 'sk' ? 'default' : 'primary'}
                value="sk"
            >
                SK
            </Button>
            <Button
                variant="outlined"
                onClick={() => i18n.changeLanguage('de')}
                size="small"
                disabled={i18n.language === 'de'}
                color={i18n.language === 'de' ? 'default' : 'primary'}
                value="de"
            >
                DE
            </Button>
            <TemperatureDropdownList
                changeTemperatureUnitsState={(units, abbreviation) => {
                    setTemperature({
                        units: units,
                        abbreviation: abbreviation,
                    });
                }}
            />

            <Switch>
                <Route
                    exact
                    path="/"
                    render={(props) => (
                        <TemperatureCtx.Provider value={temperature}>
                            <WeatherCurrentComponent {...props} />
                        </TemperatureCtx.Provider>
                    )}
                />
                <Route
                    path="/forecast"
                    render={(props) => (
                        <TemperatureCtx.Provider value={temperature}>
                            <WeatherForecastComponent {...props} />
                        </TemperatureCtx.Provider>
                    )}
                />
            </Switch>
        </main>
    );
}

export default withTranslation()(WeatherApp);
