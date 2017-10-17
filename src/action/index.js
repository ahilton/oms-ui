export const ORDER_LAST_EVENT_UPDATE = 'ORDER_LAST_EVENT_UPDATE'
export const ORDER_RESET = 'ORDER_RESET'
export const ORDER_COMPLETED_ORDERS_UPDATE = 'ORDER_COMPLETED_ORDERS_UPDATE'

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