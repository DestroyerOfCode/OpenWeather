import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom'
import WeatherCurrentComponent from './current/WeatherCurrent';
import { withTranslation } from 'react-i18next';
import WeatherForecastComponent from './forecast/daily/WeatherForecastDaily';
import {temperatureDropdownList} from '../buildingBlocks/commonBuildingBlocks'
import WeatherCurrentService from '../adapters/WeatherCurrentService';
import { nanoid } from "nanoid";
import FiltersComponent from './current/Filters'
import i18n from 'i18next'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import '../i18n'

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

function WeatherApp (props) {

    const [temperature, setTemperature] = useState({"units": "celsius", "abbreviation": "°C"})
    const classes = useStyles();

    // console.log(process.env.MONGO_URI)
    // console.log(process.env.REACT_APP_MONGO_URI)
    const internationalizeDescriptions = (descriptions) => {
        return descriptions.data.map( (description) => (
            {"name" : i18n.t("common.description." + description.originalValue), "id": description.id, "originalValue" : description.originalValue}
        ))
    }
    const internationalizeCountries = (countries) => {
        return countries.data.map( (country) => {
            return {"countryName" : i18n.t("common.countryName." + country.originalCountryName), "id": country.code, "originalCountryName" : country.originalCountryName}
        })
    }
    
    const descriptions = async(internationalize) => {
        let desc = await WeatherCurrentService.retrieveAllDescriptions();
        return  internationalize(desc)
    }
    const countries = async(internationalize) => {
        let countries = await WeatherCurrentService.retrieveAllCountries();
        return  internationalize(countries)
    }

    return (
        <main className="container"> 
            <Button variant="outlined" onClick={() => i18n.changeLanguage("en")} size='small' disabled={i18n.language === 'en'} color={i18n.language === 'en' ? "default" : "primary"} value='en'>
              EN
            </Button>
            <Button variant="outlined" onClick={() => i18n.changeLanguage("sk")} size='small' disabled={i18n.language === 'sk'} color={i18n.language === 'sk' ? "default" : "primary"} value='sk'>
              SK
            </Button>
            <Button variant="outlined" onClick={() => i18n.changeLanguage("de")} size='small' disabled={i18n.language === 'de'} color={i18n.language === 'de' ? "default" : "primary"} value='de'>
              DE
            </Button>
            {temperatureDropdownList((units, abbreviation ) => {
                setTemperature({"units" : units, "abbreviation" : abbreviation})
                }) 
            }

            <FiltersComponent key={nanoid()} 
               temperatureUnits = {temperature.units}
               countries = {countries(internationalizeCountries)}
               descriptions = {descriptions(internationalizeDescriptions)}
               temperature={temperature.abbreviation}
            />

            <Switch>
                <Route exact path ='/' render={(props) => <WeatherCurrentComponent {...props} temperature={temperature}/>}/>
                <Route path ='/forecast' render={(props) => <WeatherForecastComponent {...props} temperature={temperature}/>}/>
            </Switch>
        </main>
    )
}


export default  withTranslation()(WeatherApp)
