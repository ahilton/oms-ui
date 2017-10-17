import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {
    ORDER_COMPLETED_ORDERS_UPDATE,
    ORDER_LAST_EVENT_UPDATE,
    completedOrdersUpdate,
    lastEventUpdate
} from '../action'
const axios = require('axios')

function* pollForOrderUpdates() {

    try {
        const lastOrderResponse = yield call(
            axios.get,
            'https://botloggerk.azurewebsites.net/order/last',
            {params: {}}
        )
        console.log(lastOrderResponse)
        yield put(lastEventUpdate(lastOrderResponse.data))
    }
    catch(error){
        //TODO:: error handling
    }

    try {
        const ordersResponse = yield call(
            axios.get,
            'https://botloggerk.azurewebsites.net/orders',
            {params: {}}
        )
        console.log(ordersResponse)
        yield put(completedOrdersUpdate(ordersResponse.data))
    }
    catch(error){
        //TODO:: error handling
    }
}

function* orderSagaInit(){
    //begin polling
    while(true){
        yield call(pollForOrderUpdates)
        yield call(delay, 1000)
    }

}

function* orderSagaRoot() {
    yield takeLatest('persist/REHYDRATE', orderSagaInit)
}

export default orderSagaRoot