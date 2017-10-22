import {
    ORDER_LAST_EVENT_UPDATE,
    ORDER_RESET,
    ORDER_COMPLETED_ORDERS_UPDATE
} from '../action'
import {ORDER_STICKY_SELECT} from "../action/index";

export const orderInitialState = {
    lastEvent:{},
    lastTimestamp:null,
    completedOrders:[],
    stickySelect:{}
}

export const getOrderState = state => state.order
export const getCompletedOrders = state => getOrderState(state).completedOrders
export const getLastEvent = state => getOrderState(state).lastEvent
export const getLastTimestamp = state => getOrderState(state).lastTimestamp
export const getStickySelect = state => getOrderState(state).stickySelect

const order = (state = orderInitialState, action) => {
    switch(action.type) {
        case ORDER_LAST_EVENT_UPDATE:
            return {
                ...state,
                lastEvent: action.data,
                lastTimestamp: action.data?action.data.timestamp:state.lastTimestamp,
                stickySelect: orderInitialState.stickySelect
            }
        case ORDER_COMPLETED_ORDERS_UPDATE:
            return {
                ...state,
                completedOrders: action.data
            }
        case ORDER_STICKY_SELECT:
            return {
                ...state,
                stickySelect:{...action.data}
            }
        case ORDER_RESET:
            return {
                ...state,
                lastEvent: orderInitialState.lastEvent,
                completedOrders: orderInitialState.completedOrders,
                stickySelect: orderInitialState.stickySelect
            }
        default:
            return state
    }
}

export default order