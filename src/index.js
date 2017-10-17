import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import allReducers, {initialState} from './redux'
import {Provider} from 'react-redux'
import {compose, createStore, applyMiddleware} from 'redux'
import {persistStore, autoRehydrate, createTransform} from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware()
let store = createStore(
    allReducers,
    initialState,
    composeWithDevTools(
        applyMiddleware(sagaMiddleware),
        autoRehydrate()
    )
)

sagaMiddleware.run(rootSaga)

function filterState(state){
    return {...state, something: {}}
}

let filterTransform = createTransform(
    filterState,
    filterState,
    {}
)

persistStore(store, {
    transforms: [filterTransform]
})

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker();
