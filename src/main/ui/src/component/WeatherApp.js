import React, { Component } from 'react';
import WeatherListComponent from './WeatherListComponent';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class WeatherApp extends Component{
    render() {
        return (<>
             {/* <Router>
                 <>
                     <h1>Weather Application</h1>
                     <Switch>
                         <Route path="/" exact component={WeatherListComponent} />
                         <Route path="/weathers" exact component={WeatherListComponent} />
                     </Switch>
                 </>
             </Router> */}
            <WeatherListComponent/>
            </>
        )
    }
}
export default WeatherApp
