
import {WEB_CHAT_TOGGLE} from "../action/index";

export const settingsInitialState = {
    webChatEnabled:false
}

export const getSetingsState = state => state.settings
export const webChatEnabled = state => getSetingsState(state).webChatEnabled

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