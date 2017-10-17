import {call} from 'redux-saga/effects'

import orderSagaRoot from './orderSaga'

export default function* root () {
    yield [
        call(orderSagaRoot)
    ]
}