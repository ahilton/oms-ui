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
import StockCard from "./components/StockCard";

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
                switch(order.direction.toLowerCase()) {
                    case 'sell':
                        return {
                            bg:Colors.RED3,
                            fg:Colors.RED2
                        }
                    case 'buy':
                        return {
                            bg:Colors.GREEN3,
                            fg:Colors.GREEN2
                        }
                }
            }
        }
        return defaultColors
    }

    renderOrderComponent = (order) => {
        const stockDetails = order&&order.stock?this.getDetailsForStock(order.stock):{
            code: '',
            name: ''
        }
        const colorChart = this.getColorChart(order)
        return <div style={{
            backgroundColor:colorChart.bg,
            display:'flex',
            flex:1,
            alignItems:'center', // vertical
            justifyContent: 'center', //horizontal
        }}>
            <StockCard {...{
                stockDetails:stockDetails,
                order:order,
                colorFg: colorChart.fg
            }}/>
        </div>
    }

    renderStockSelection = (order) => {

        const stockComponent = Object.keys(this.stockDetails).map(
            (key) => <StockCard {...{
                stockDetails:this.stockDetails[key],
                containerStyle:{
                    width:350,
                    height:300,
                    marginRight:20,
                    marginLeft:20
                },
                order:{},
                colorFg: Colors.BLUE3,
                key: key+"_stockSelection",
                content: <span style={{
                    fontSize:60,
                    color:Colors.BLUE2
                }}>
                    {key}
                </span>
            }}/>
        )
        return <Flex wrap style={{
                height:'100%',
                backgroundColor:Colors.LIGHT_GRAY1,
                flex:1,
                alignItems:'center', // vertical
                justifyContent: 'center', //horizontal
            }}>
                {stockComponent}
            </Flex>
    }

    render() {
        const {lastEvent, completedOrders} = this.props
        const order = lastEvent?lastEvent.lastOrderState:{}

        const orderComponent = (order && order.stock)?
            this.renderOrderComponent(order):
            this.renderStockSelection()

        return (
            <div className="App"  style={{
                display:'flex',
                flexDirection:'column',
                height:'100%'
            }}>
                {orderComponent}
                <div>
                    {/*USE A PHANTOM BLOCK TO PREVENT THE FOOTER AFFECTING PAGE FLOW*/}
                    <div style={{
                        display:'block',
                        height:180,
                        width:'100%'
                    }}/>
                    {/*FIXED FOOTER*/}
                    <div style={{
                        height:180,
                        position:'fixed', left:0, bottom:0,
                        width:'100%',
                        backgroundColor:Colors.BLUE1,
                        display:'flex',
                        alignItems:'center', // vertical
                        justifyContent: 'center', //horizontal
                    }}>
                        <h1 style={{
                            color:Colors.LIGHT_GRAY4,
                        }}
                        >
                            <Icon iconName="chat" iconSize="inherit" style={{
                                marginRight:25,
                                color:Colors.BLUE5,
                                fontSize:60
                            }}/>
                            {lastEvent.lastSystemMessage}
                        </h1>
                    </div>
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
