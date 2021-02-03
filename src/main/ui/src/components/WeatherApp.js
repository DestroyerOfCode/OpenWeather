import React from 'react';
import { Switch, Route } from 'react-router-dom'
import WeatherCurrentComponent from './current/WeatherCurrent';

import WeatherForecastComponent from './forecast/daily/WeatherForecastDaily';

const WeatherApp = () =>(
    <main>    
        <Switch>
            <Route exact path ='/' component= {WeatherCurrentComponent}/>
            <Route path ='/forecast' component= {WeatherForecastComponent}/>

        </Switch>
    </main>
)
export default WeatherApp
