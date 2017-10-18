import React, {Component} from 'react';

import {connect} from 'react-redux'

import 'normalize.css/normalize.css'
import '@blueprintjs/core/dist/blueprint.css'
import './App.css';

import {
    getCompletedOrders,
    getLastEvent
} from './redux/order'

class App extends Component {

    /*

      lastEvent: {
      conversationId: null,
      channel: null,
      lastUserMessage: null,
      lastOrderState: {
        stock: 'Apple',
        qty: 1000,
        direction: 'Sell',
        completed: true
      },
      lastSystemMessage: null,
      choices: null
    },

    * */

    render() {
        const {lastEvent, completedOrders} = this.props

        return (
            <div className="App">

                <div>
                    {lastEvent.lastSystemMessage}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        completedOrders: getCompletedOrders(state),
        lastEvent: getLastEvent(state)
    }
}

export default connect(mapStateToProps)(App);
