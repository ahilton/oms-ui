
import {WEB_CHAT_TOGGLE} from "../action/index";

export const settingsInitialState = {
    webChatEnabled:false,
    channelKeys:{
        webchat:'YoU7MvKr_Yk.cwA.VlQ.cQGefYItjezJ9wS5zTpu6MSM9j3ZWdu9HJ0EgGeMQaU'
    }
}

export const getSetingsState = state => state.settings
export const webChatEnabled = state => getSetingsState(state).webChatEnabled
export const channelKeys = state => getSetingsState(state).channelKeys

const settings = (state = settingsInitialState, action) => {
    switch(action.type) {
        case WEB_CHAT_TOGGLE:
            return {
                ...state,
                webChatEnabled: !state.webChatEnabled
            }
        default:
            return state
    }
}

export default settings