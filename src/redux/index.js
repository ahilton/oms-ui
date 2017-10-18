import {combineReducers} from 'redux'
import order, {orderInitialState} from './order'
import settings, {settingsInitialState} from "./settings";

export default combineReducers({
    order,
    settings
})

export const initialState={
    order: orderInitialState,
    settings: settingsInitialState
}