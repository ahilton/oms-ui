import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {
    ORDER_COMPLETED_ORDERS_UPDATE,
    ORDER_LAST_EVENT_UPDATE,
    completedOrdersUpdate,
    lastEventUpdate
} from '../action'
import {PUSH_CHANNEL_EVENT} from "../action/index";
const axios = require('axios')
const botLoggerHostName =  'https://omslogger.azurewebsites.net' //'http://localhost:8080'
const nexusHostName = 'http://localhost:8080'

function* pollForOrderUpdates() {

    try {
        const lastOrderResponse = yield call(
            axios.get,
            botLoggerHostName+'/order/last',
            {params: {}}
        )
        //console.log(lastOrderResponse)
        yield put(lastEventUpdate(lastOrderResponse.data))
    }
    catch(error){
        console.log(error)
        //TODO:: error handling
    }

    try {
        const ordersResponse = yield call(
            axios.get,
            botLoggerHostName+'/orders',
            {params: {}}
        )
        //console.log(ordersResponse)
        yield put(completedOrdersUpdate(ordersResponse.data))
    }
    catch(error){
        console.log(error)
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

function* pushChannelEvent(action){
    const {message, key, conversationId} = action
    try {
        const pushResponse = yield call(
            axios.put,
            nexusHostName+'/event/push',
            {
                message:message,
                channelKey:key,
                conversationId:conversationId
            }
        )
        console.log(pushResponse)
    }
    catch(error){
        console.log(error)
        //TODO:: error handling
    }
}

function* orderSagaRoot() {
    yield takeLatest('persist/REHYDRATE', orderSagaInit)
    yield takeEvery(PUSH_CHANNEL_EVENT, pushChannelEvent)
}

export default orderSagaRoot