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
import {getLastEvent, getLastTimestamp, getTickData} from "../redux/order";
import {ENABLE_PRICE_TICK, priceTick} from "../action/index";
const axios = require('axios')
const botLoggerHostName = 'https://omslogger.azurewebsites.net'
// const botLoggerHostName = 'http://localhost:8080'
const gatewayHostName = 'https://omsgateway.azurewebsites.net'
// const gatewayHostName = 'http://localhost:8080'

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
        const responseData = lastOrderResponse.data
        if (responseData && lastTimestamp && (!responseData.timestamp || responseData.timestamp===lastTimestamp)){
            // Continue with updates only when the timestamp of the last event changes to avoid flickering effects
            return
        }
        yield put(lastEventUpdate(responseData))
        if (responseData && responseData.lastSystemMessage && responseData.lastSystemMessage.startsWith('Ok, you have')){
            yield put(stickySelect({
                lastOrderHighlight:{
                    stock:responseData.lastOrderState?responseData.lastOrderState.stock:null
                }
            }))
            yield put(blotterSelect(true))
            return
        }

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
                    timeStamp:lastOrderResponse.data.lastOrderState.timestamp
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

function* enablePriceTick() {
    var lastPrice
    yield call(delay, 4000)
    //begin polling
    while(true){
        var tickData = yield select((store) => getTickData(store))
        if (!tickData || !tickData.enabled){
            break
        }

        lastPrice = yield call(tickPrice, lastPrice)
        yield call(delay, 2000)
    }
}

function* tickPrice(lastPrice){
    var lastEvent = yield select((store) => getLastEvent(store))
    if (!lastEvent || !lastEvent.lastOrderState || !lastEvent.lastOrderState.stock){
        return
    }
    const stock = lastEvent.lastOrderState.stock
    let randomPrice = getSharePrice(stock);
    let newPrice = lastPrice?(((30*lastPrice)+randomPrice)/31):randomPrice
    yield put(priceTick(newPrice))
    return newPrice
}

function getSharePrice(stock) {
    var min = 10
    var max = 24
    if (stock.toLowerCase()==='ibm'){
        min = 170
        max = 210
    } else if(stock.toLowerCase() ==='microsoft'){
        min = 80
        max = 101
    } else if(stock.toLowerCase() ==='apple') {
        min = 160
        max = 190
    } else if(stock.toLowerCase() ==='sony') {
        min = 30
        max = 40
    }

    return getRandomPrice(min, max);
}

function getRandomPrice(min, max) {
    return Math.random() * (max - min) + min;
}

function* orderSagaRoot() {
    yield takeLatest('persist/REHYDRATE', orderSagaInit)
    yield takeEvery(PUSH_CHANNEL_EVENT, pushChannelEvent)
    yield takeLatest(ENABLE_PRICE_TICK, enablePriceTick)
}

export default orderSagaRoot