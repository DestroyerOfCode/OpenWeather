import React from 'react';
import { Switch, Route } from 'react-router-dom'
import WeatherCurrentComponent from './WeatherCurrentComponent';

import WeatherForecastComponent from './WeatherForecastComponent';

const WeatherApp = () =>(
    <main>    
        <Switch>
            <Route exact path ='/' component= {WeatherCurrentComponent}/>
            <Route path ='/forecast' component= {WeatherForecastComponent}/>

        </Switch>
    </main>
)
export default WeatherApp
