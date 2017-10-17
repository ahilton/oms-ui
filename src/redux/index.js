import {combineReducers} from 'redux'
import order, {orderInitialState} from './order'

const allReducers = combineReducers({
    order
})

export default allReducers

export const initialState={
    order: orderInitialState
}