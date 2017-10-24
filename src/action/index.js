export const ORDER_LAST_EVENT_UPDATE = 'ORDER_LAST_EVENT_UPDATE'
export const ORDER_RESET = 'ORDER_RESET'
export const ORDER_COMPLETED_ORDERS_UPDATE = 'ORDER_COMPLETED_ORDERS_UPDATE'
export const ORDER_STICKY_SELECT = 'ORDER_STICKY_SELECT'

export const WEB_CHAT_TOGGLE = 'WEB_CHAT_TOGGLE'
export const BLOTTER_TOGGLE = 'BLOTTER_TOGGLE'
export const BLOTTER_SELECT = 'BLOTTER_SELECT'

export const PUSH_CHANNEL_EVENT = 'PUSH_CHANNEL_EVENT'

export const lastEventUpdate = (lastEvent) => {
    return {
        type:ORDER_LAST_EVENT_UPDATE,
        data:lastEvent
    }
}

export const completedOrdersUpdate = (completedOrders) => {
    return {
        type:ORDER_COMPLETED_ORDERS_UPDATE,
        data:completedOrders
    }
}

export const reset = () => {return {type:ORDER_RESET}}

export const webChatToggle = () => {return {type:WEB_CHAT_TOGGLE}}

export const blotterToggle = () => {return {type:BLOTTER_TOGGLE}}

export const blotterSelect = (selected) => {return {type:BLOTTER_SELECT, selected: selected}}

export const clearLastOrder = () => {return lastEventUpdate(null)}

export const pushChannelEvent = (message, key, conversationId, userId, userName) => {
    return {
        type:PUSH_CHANNEL_EVENT,
        message:message,
        key: key,
        conversationId: conversationId,
        userId: userId,
        userName: userName
    }
}

export const stickySelect = (data) => {
    return {
        type:ORDER_STICKY_SELECT,
        data:data
    }
}