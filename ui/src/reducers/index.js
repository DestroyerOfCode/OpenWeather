import { combineReducers } from 'redux';
import { filters } from './filters.reducer';
import { weatherCurrent } from './weather.current.reducer';
import { countries } from './countries.reducer';
import { descriptions } from './descriptions.reducer';

const rootReducer = combineReducers({
    filters,
    weatherCurrent,
    countries,
    descriptions,
});

export default rootReducer;
