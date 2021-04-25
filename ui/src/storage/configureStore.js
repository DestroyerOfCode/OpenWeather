// import {createStore, applyMiddleware, compose } from 'redux';
// import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
// import thunk from "redux-thunk";
// import rootReducer from "../reducers";

// export default function configureStore() {
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// return createStore(
// rootReducer,
// composeEnhancers(applyMiddleware(thunk))
// );
// }
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
);
