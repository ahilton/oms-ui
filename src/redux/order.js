import {
    ORDER_LAST_EVENT_UPDATE,
    ORDER_RESET,
    ORDER_COMPLETED_ORDERS_UPDATE
} from '../action'
import {initialState} from "./index";

export const orderInitialState = {
    lastEvent:{},
    completedOrders:[]
}

export const getOrderState = state => state.order
export const getCompletedOrders = state => getOrderState(state).completedOrders
export const getLastEvent = state => getOrderState(state).lastEvent

const order = (state = orderInitialState, action) => {
    switch(action.type) {
        case ORDER_LAST_EVENT_UPDATE:
            return {
                ...state,
                lastEvent: action.data
            }
        case ORDER_COMPLETED_ORDERS_UPDATE:
            return {
                ...state,
                completedOrders: action.data
            }
        case ORDER_RESET:
            return {
                ...state,
                lastEvent: initialState.lastEvent,
                completedOrders: initialState.data
            }
        default:
            return state
    }
}

export default order