import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {
    ORDER_COMPLETED_ORDERS_UPDATE,
    ORDER_LAST_EVENT_UPDATE,
    PUSH_CHANNEL_EVENT,
    completedOrdersUpdate,
    lastEventUpdate,
    blotterSelect,
    stickySelect
} from '../action'
import {getLastEvent, getLastTimestamp} from "../redux/order";
const axios = require('axios')
const botLoggerHostName = 'https://omslogger.azurewebsites.net'
// const botLoggerHostName = 'http://localhost:8080'
const gatewayHostName = 'https://omsgateway.azurewebsites.net'
//const gatewayHostName = 'http://localhost:8080'

function systemMessageExists(lastOrderResponse) {
    return lastOrderResponse && lastOrderResponse.data && lastOrderResponse.data.lastSystemMessage;
}

function* pollForOrderUpdates() {

    var lastTimestamp = yield select((store) => getLastTimestamp(store))
    var lastOrderResponse
    try {
        lastOrderResponse = yield call(
            axios.get,
            botLoggerHostName+'/order/last',
            {params: {}}
        )
        //console.log(lastOrderResponse)
        if (lastOrderResponse.data && lastTimestamp && (!lastOrderResponse.data.timestamp || lastOrderResponse.data.timestamp===lastTimestamp)){
            // Continue with updates only when the timestamp of the last event changes to avoid flickering effects
            return
        }
        yield put(lastEventUpdate(lastOrderResponse.data))

    }
    catch(error){
        console.log(error)
        return
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


    if (systemMessageExists(lastOrderResponse) && lastOrderResponse.data.lastSystemMessage.startsWith('OK, order completed')){
        const lastStock = lastOrderResponse.data&&lastOrderResponse.data.lastOrderState?lastOrderResponse.data.lastOrderState.stock:null
        if (lastStock){
            yield call(delay, 4000)

            yield put(stickySelect({
                lastOrderHighlight:{
                    stock:lastStock,
                    timeStamp:'xyz'
                }
            }))
            yield put(blotterSelect(true))
        }
    }
    else {
        yield put(stickySelect({}))
        yield put(blotterSelect(false))
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
    const {message, key, conversationId, userId, userName} = action
    try {
        const pushResponse = yield call(
            axios.put,
            gatewayHostName+'/event/push',
            {
                message:message,
                channelKey:key,
                conversationId:conversationId,
                userId:userId,
                userName:userName
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