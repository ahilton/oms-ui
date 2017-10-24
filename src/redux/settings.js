
import {
    WEB_CHAT_TOGGLE,
    BLOTTER_TOGGLE,
    BLOTTER_SELECT
} from "../action";

/*
 * TODO:: remove key configuration from saga!
 *
 */
export const settingsInitialState = {
    webChatEnabled:false,
    blotterEnabled:false,
    channelKeys:{
        webchat:'YoU7MvKr_Yk.cwA.VlQ.cQGefYItjezJ9wS5zTpu6MSM9j3ZWdu9HJ0EgGeMQaU'
    }
}

export const getSetingsState = state => state.settings
export const webChatEnabled = state => getSetingsState(state).webChatEnabled
export const blotterEnabled = state => getSetingsState(state).blotterEnabled
export const channelKeys = state => getSetingsState(state).channelKeys

const settings = (state = settingsInitialState, action) => {
    switch(action.type) {
        case WEB_CHAT_TOGGLE:
            return {
                ...state,
                webChatEnabled: !state.webChatEnabled
            }
        case BLOTTER_TOGGLE:
            return {
                ...state,
                blotterEnabled: !state.blotterEnabled
            }
        case BLOTTER_SELECT:
            return {
                ...state,
                blotterEnabled: action.selected
            }
        default:
            return state
    }
}

export default settings