import React, {Component} from 'react';

import {connect} from 'react-redux'

import 'normalize.css/normalize.css'
import '@blueprintjs/core/dist/blueprint.css'
import 'react-table/react-table.css'
import "react-progress-2/main.css"

import './App.css';

import {
    getCompletedOrders,
    getLastEvent, getStickySelect
} from './redux/order'

import {
    webChatEnabled,
    channelKeys, blotterEnabled
} from "./redux/settings"

import {
    webChatToggle,
    blotterToggle,
    pushChannelEvent,
    stickySelect,
    clearLastOrder
} from "./action"

import { Colors, Icon } from "@blueprintjs/core";

import {Box, Flex} from "reflexbox";

import StockCard from "./components/StockCard";
import Footer from "./components/Footer";
import StockSelection from "./components/StockSelection";
import ToggleButton from "./components/ToggleButton";
import FloatingToggleButton from "./components/FloatingToggleButton";
import Blotter from "./components/Blotter";
import LoadingB from "./components/LoadingB";
import LaunchPage from "./components/LaunchPage";

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

    renderOrderComponent = (showBuySell, order, stickySelect) => {
        const stockDetails = order&&order.stock?this.getDetailsForStock(order.stock):{
            code: '',
            name: ''
        }
        let subComponent=null
        const colorChart = this.getColorChart(order)

        if (showBuySell){
            const selectedBuySell = stickySelect&&stickySelect.buysell?stickySelect.buysell:null
            let sellClassName,buyClassName,buySellClassName
            if (selectedBuySell){
                sellClassName = selectedBuySell==='buy'?'deselected':''
                buyClassName = selectedBuySell==='sell'?'deselected':''
                buySellClassName = 'selection-made'
            }
            subComponent = <div>
                <Flex wrap align='center' w={1} p={0} className={'buy-sell-choice '+buySellClassName} style={{
                    textAlign:'center',
                    fontSize: 40,
                    fontVariant: 'small-caps'
                }}>
                    <Box  w={1/2} p={1} className={'buy-choice '+buyClassName} onClick={()=>this.handleBSSelect('buy', this.props.lastEvent)}>
                        buy
                    </Box>
                    <Box  w={1/2} p={1} className={'sell-choice '+sellClassName} onClick={()=>this.handleBSSelect('sell', this.props.lastEvent)}>
                        sell
                    </Box>
                </Flex>
            </div>

        }

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
                colorFg: colorChart.fg,
                footer:subComponent
            }}>
            </StockCard>
        </div>
    }

    handleStockSelect = (stock, lastEvent) => {
        this.handlepushChannelEvent(stock, lastEvent, {stock:stock})
    }

    handleBSSelect = (bs, lastEvent) => {
        this.handlepushChannelEvent(bs, lastEvent, {buysell:bs})
    }

    handlepushChannelEvent = (msg, lastEvent, ss) => {
        this.props.dispatch(pushChannelEvent(msg, this.props.channelKeys[lastEvent.channel], lastEvent.conversationId, lastEvent.userId, lastEvent.userName))
        this.props.dispatch(stickySelect(ss))
    }

    renderStockSelection = (pushEvents, lastEvent, stickySelect) => {

        return <StockSelection {...{
            stockDetails: this.stockDetails,
            pushEvents: pushEvents,
            lastEvent: lastEvent,
            stickySelect: stickySelect,
            handleStockSelect:this.handleStockSelect
        }}/>
    }

    renderToggleButton = (fixedStyle, iconName, handleClick) => {
        return (
            <FloatingToggleButton {...{fixedStyle, iconName, handleClick}}/>
        )
    }

    renderFooter = (lastEvent) => {
        return (
            <Footer {...{
                lastSystemMessage:lastEvent.lastSystemMessage
            }}>
                <ToggleButton {...{style:{marginRight:25, color:Colors.BLUE5}, iconName:'chat', handleClick:this.toggleWebChat}}/>
            </Footer>
        )
    }

    renderWebchat = () => {
        return (
            <div style={{
                display:'flex',
                height:'100%',
                width:400
            }}>
                <iframe
                    style={{height:'100%', width:400}}
                    src={'https://webchat.botframework.com/embed/VenusBot?s='+this.props.channelKeys.webchat}>
                </iframe>
            </div>
        )
    }

    toggleWebChat = () => {
        this.props.dispatch(webChatToggle())
    }

    toggleView = () => {
        this.props.dispatch(blotterToggle())
    }

    handleClear = () => {
        this.props.dispatch(clearLastOrder())
    }

    pageGrowStyle = {
        display:'flex',
        flexDirection:'column',
        height:'100%',
        flex:1
    }

    render() {
        const {lastEvent, completedOrders, webChatEnabled, blotterEnabled, stickySelect} = this.props
        const orderPageEnabled = lastEvent?true:false
        const order = lastEvent?lastEvent.lastOrderState:{}

        const pushEvents = lastEvent&&(lastEvent.channel==='webchat'||lastEvent.channel==='directline')
        const showBuySell = pushEvents&&lastEvent&&lastEvent.lastSystemMessage&&lastEvent.lastSystemMessage.startsWith("Would you like to buy or sell")

        const orderComponent = (order && order.stock)?
            this.renderOrderComponent(showBuySell, order, stickySelect):
            this.renderStockSelection(pushEvents, lastEvent, stickySelect)

        const orderPage = lastEvent?<div style={this.pageGrowStyle}>
            {this.renderToggleButton({left:0, top:0}, 'dashboard', this.toggleView)}
            {this.renderToggleButton({left:0, top:60}, 'small-cross', this.handleClear)}
            {orderComponent}
            {!webChatEnabled && this.renderFooter(lastEvent)}
            {webChatEnabled && this.renderToggleButton({left:0, bottom:0}, 'chat', this.toggleWebChat)}
        </div>:<div style={this.pageGrowStyle}>
            {this.renderToggleButton({left:0, top:0}, 'dashboard', this.toggleView)}
            <LaunchPage/>
            {this.renderToggleButton({left:0, bottom:0}, 'chat', this.toggleWebChat)}
        </div>

        return (

            <div style={{
                display:'flex',
                flexDirection:'row',
                height:'100%'
            }}>
                {stickySelect && Object.keys(stickySelect).length > 0 && <LoadingB />}
                {blotterEnabled && <div style={this.pageGrowStyle}>
                    <Blotter {...{
                        stockDetails:this.stockDetails,
                        stickySelect:stickySelect,
                        completedOrders
                    }}/>
                    {this.renderToggleButton({left:0, top:0}, 'cell-tower', this.toggleView)}
                </div>}
                {!blotterEnabled && orderPage}
                {webChatEnabled && this.renderWebchat()}
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        completedOrders: getCompletedOrders(state),
        lastEvent: getLastEvent(state),
        stickySelect:getStickySelect(state),
        blotterEnabled: blotterEnabled(state),
        webChatEnabled: webChatEnabled(state),
        channelKeys: channelKeys(state)
    }
}

export default connect(mapStateToProps)(App);
