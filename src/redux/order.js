import {
    ORDER_LAST_EVENT_UPDATE,
    ORDER_RESET,
    ORDER_COMPLETED_ORDERS_UPDATE,
    PRICE_TICK,
    ENABLE_PRICE_TICK,
    DISABLE_PRICE_TICK
} from '../action'
import {ORDER_STICKY_SELECT} from "../action/index";

export const orderInitialState = {
    lastEvent:{},
    lastTimestamp:null,
    completedOrders:[],
    tickData:{
        price:null,
        enabled:false
    },
    stickySelect:{}
}

export const getOrderState = state => state.order
export const getCompletedOrders = state => getOrderState(state).completedOrders
export const getLastEvent = state => getOrderState(state).lastEvent
export const getLastTimestamp = state => getOrderState(state).lastTimestamp
export const getTickData = state => getOrderState(state).tickData
export const getStickySelect = state => getOrderState(state).stickySelect

const order = (state = orderInitialState, action) => {
    switch(action.type) {
        case ORDER_LAST_EVENT_UPDATE:
            return {
                ...state,
                lastEvent: action.data,
                lastTimestamp: action.data?action.data.timestamp:state.lastTimestamp,
                stickySelect: orderInitialState.stickySelect,
                tickData: orderInitialState.tickData
            }
        case ORDER_COMPLETED_ORDERS_UPDATE:
            return {
                ...state,
                completedOrders: action.data
            }
        case ORDER_STICKY_SELECT:
            return {
                ...state,
                stickySelect:{...action.data},
                tickData: orderInitialState.tickData
            }
        case ORDER_RESET:
            return {
                ...state,
                lastEvent: orderInitialState.lastEvent,
                completedOrders: orderInitialState.completedOrders,
                stickySelect: orderInitialState.stickySelect,
                tickData: orderInitialState.tickData
            }
        case PRICE_TICK:
            return {
                ...state,
                tickData:{
                    ...state.tickData,
                    price:action.price
                }
            }
        case ENABLE_PRICE_TICK:
            return {
                ...state,
                tickData:{
                    price:null,
                    enabled:true
                }
            }
        case DISABLE_PRICE_TICK:
            return {
                ...state,
                tickData:{
                    price:null,
                    enabled:false
                }
            }
        default:
            return state
    }
}

export default order