import React, {Component} from 'react';

import {connect} from 'react-redux'

import 'normalize.css/normalize.css'
import '@blueprintjs/core/dist/blueprint.css'
import './App.css';

import {
    getCompletedOrders,
    getLastEvent
} from './redux/order'
import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";

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

    stockDetails = {
        apple: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=svgporn-apple', width:60},
            code: 'AAPL',
            name: 'Apple Inc.'
        },
        microsoft: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=svgporn-microsoft', width:120},
            code: 'MSFT',
            name: 'Microsoft Corporation'
        },
        ibm: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=logomono-ibm-mono', width:100},
            code: 'IBM',
            name: 'IBM Corp.'
        },
        sony: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=logomono-sony-mono', width:120},
            code: 'SNE',
            name: 'Sony Corp (ADR)'
        },
        dell: {
            logo: {url: 'http://cdn.instantlogosearch.com/png?id=logomono-dell-mono', width:90},
            code: 'DELL',
            name: 'Dell Inc.'
        }
    }

    getDetailsForStock = (stock) => {
        return this.stockDetails[stock.toLowerCase()]
    }

    getColorChart = (order) => {
        const defaultColors = {
            bg:Colors.LIGHT_GRAY1,
            fg:Colors.BLUE3
        }
        if (order){
            if (order.completed){
                return {
                    bg:Colors.BLUE3,
                    fg:Colors.BLUE3
                }
            }
            if (order.direction){
                switch(order.direction) {
                    case 'Sell':
                        return {
                            bg:Colors.RED3,
                            fg:Colors.RED1
                        }
                    case 'Buy':
                        return {
                            bg:Colors.GREEN3,
                            fg:Colors.GREEN1
                        }
                }
            }
        }
        return defaultColors
    }

    render() {
        const {lastEvent, completedOrders} = this.props
        const order = lastEvent?lastEvent.lastOrderState:{}
        console.log(order)
        const stockDetails = order&&order.stock?this.getDetailsForStock(order.stock):{
            code: '',
            name: 'Empty Order Ticket'
        }
        const colorChart = this.getColorChart(order)
        return (
            <div className="App"  style={{

            }}>

                <div style={{
                    height:500,
                    backgroundColor:colorChart.bg,
                    display:'flex',
                    alignItems:'center', // vertical
                    justifyContent: 'center', //horizontal
                }}>
                    <div className="pt-card pt-elevation-4" style={{width:400}}>
                        <Flex wrap align='left' w={1} p={0}>
                            <Box  w={1/3} p={1}>
                                {stockDetails.logo && <img src={stockDetails.logo.url} width={stockDetails.logo.width}/>}
                            </Box>
                            <Box justify='end' w={2/3} p={0} style={{textAlign:'right'}}>
                                <div className="" style={{
                                    fontSize:50,
                                    fontFamily:'Arial Black'
                                }}>
                                    {stockDetails.code}
                                </div>
                                <div className="" style={{
                                }}>
                                    {stockDetails.name}
                                </div>
                            </Box>

                            <Box w={1} p={40} style={{textAlign:'center'}}>
                                <div style={{textAlign:'left', display:'inline-block', fontSize:40, marginRight:20}}>
                                    {order && order.completed && <Icon className="pt-intent-success" iconName="tick-circle" iconSize="inherit"/>}
                                </div>

                                <div style={{textAlign:'left', display:'inline-block'}}>
                                    <div style={{
                                        fontSize:40,
                                        fontVariant: 'small-caps',
                                        color:colorChart.fg
                                    }}>{order && order.direction && order.direction.toLowerCase()}</div>
                                    <div style={{
                                        fontSize:70,
                                    }}>

                                        {order && order.qty && order.qty.toLocaleString()}</div>
                                </div>
                            </Box>
                        </Flex>

                    </div>
                </div>
                <div style={{
                    height:200,
                    backgroundColor:Colors.DARK_GRAY4,
                    display:'flex',
                    alignItems:'center', // vertical
                    justifyContent: 'center', //horizontal

                }}>
                    <h1 style={{
                        color:Colors.LIGHT_GRAY4
                    }}
                    >
                        <Icon iconName="chat" iconSize="inherit" style={{
                            marginRight:15,
                            color:Colors.GRAY4
                        }}/>
                        {lastEvent.lastSystemMessage}
                    </h1>
                </div>
                <div>
d
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
