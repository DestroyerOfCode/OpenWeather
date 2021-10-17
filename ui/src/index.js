import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './storage/configureStore';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { HashRouter } from 'react-router-dom';
import { Suspense } from 'react';
import CustomCircularLoader from './buildingBlocks/CustomCircularLoader';
import './i18n';
// const store = createStore(store);

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Suspense fallback={<CustomCircularLoader />}>
                <HashRouter key="hashRouter">
                    <App />
                </HashRouter>
            </Suspense>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
