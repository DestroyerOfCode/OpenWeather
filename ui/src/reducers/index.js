import { combineReducers } from "redux";
import { filters } from "./filters.reducer";
import { weatherCurrent } from "./weather.current.reducer"

const rootReducer = combineReducers({
    filters,
    weatherCurrent
});

export default rootReducer;