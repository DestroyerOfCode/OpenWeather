import React, {useEffect, useState} from 'react';
import { Switch, Route } from 'react-router-dom'
import WeatherCurrentComponent from './current/WeatherCurrent';
import { withTranslation } from 'react-i18next';
import WeatherForecastComponent from './forecast/daily/WeatherForecastDaily';
import {temperatureDropdownList} from '../buildingBlocks/commonBuildingBlocks'

import i18n from 'i18next'
import '../i18n'

function WeatherApp (props) {

    const [temperature, setTemperature] = useState({"units": "celsius", "abbreviation": "°C"})
    console.log(temperature)

    useEffect(() =>{

    },[props])
    console.log(process.env.MONGO_URI)
    console.log(process.env.REACT_APP_MONGO_URI)
    return <main> 
        <div>                               
            <button onClick={() => i18n.changeLanguage("en")}>EN</button>
            <button onClick={() => i18n.changeLanguage("sk")}>SK</button>   
            <button onClick={() => i18n.changeLanguage("de")}>DE</button>  
            {temperatureDropdownList( async (units, abbreviation ) => {
                console.log(units)
                await setTemperature({"units" : units, "abbreviation" : abbreviation})
                }) 
            }
        </div>,   
        <Switch>
            <Route exact path ='https://tvoje-pocasie.herokuapp.com' render={(props) => {console.log(props);return <WeatherCurrentComponent {...props} temperature={temperature}/>}}/>
            <Route path ='/forecast' render={(props) => <WeatherForecastComponent {...props} temperature={temperature}/>}/>

        </Switch>
    </main>
}


export default  withTranslation()(WeatherApp)
