import React, {Component} from 'react';

import { PieChart, Pie, Sector, Cell } from 'recharts';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";
import StockCard from "./StockCard";
import ReactTable from "react-table";
import * as _ from "lodash";

function getQtyWIthDirecion(direction, qty) {
    return (direction.toLowerCase() === 'sell' ? -1 : 1) * qty;
}

function niceNumber(num){
    return num.toLocaleString(undefined);
}

function niceDecimal(num){
    return num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

export default class ToggleButton extends Component {

    /*
    *
    *   completedOrders: [
    {
      stock: 'dell',
      qty: 670,
      direction: 'Buy',
      completed: true
    },
    {
      stock: 'sony',
      qty: 500000,
      direction: 'Buy',
      completed: true
    },
    {
      stock: 'Microsoft',
      qty: 1000000,
      direction: 'Sell',
      completed: true
    }
  ]
}
    *
    * */


    buyColors = ['#00B3A4', '#29A634', '#0F9960', '#9BBF30']
    sellColors = ['#D13913', '#DB3737', '#DB2C6F', '#8F398F']

    render() {
        const {completedOrders, stockDetails, stickySelect} = this.props
        const highlightedStock = stickySelect &&
                                    stickySelect.lastOrderHighlight &&
                                    stickySelect.lastOrderHighlight.stock?
                                    stickySelect.lastOrderHighlight.stock.toLowerCase():null
        const highlightedOrderTime = stickySelect &&
                                    stickySelect.lastOrderHighlight &&
                                    stickySelect.lastOrderHighlight.timeStamp?
                                        stickySelect.lastOrderHighlight.timeStamp:null
        var holdings = {}
        if (completedOrders){
            for (var i=0; i<completedOrders.length;i++){
                const fill = completedOrders[i]
                const stock = fill.stock.toLowerCase()
                if (!holdings[stock]){
                    holdings[stock]=0
                }
                const qty = getQtyWIthDirecion(fill.direction, fill.qty)
                holdings[stock]+=qty
            }
        }
        console.log(holdings)


        var data = Object.keys(holdings).map((key)=>{
            return {
                name:key,
                value:Math.abs(holdings[key])
            }
        })

        const renderStockLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            if (percent < 0.05){
                return ''
            }
            return data[index].name+': '+data[index].value.toLocaleString()
        };

        const columns = [
            {
                Header: 'Code',
                id: 'code',
                accessor: o=>stockDetails[o.stock.toLowerCase()].code,
                aggregate:vals=>_.uniq(vals),
                Cell:row=><span><span className='pointer'/>{row.value}</span>,
                style:{textAlign:'center'},
                width: 80
            },{
                Header: 'Stock',
                accessor: 'stock',
                width: 150
            }, {
                Header: 'Date',
                accessor: 'timestamp',
                Cell:row=>row.value?new Date(row.value).toLocaleDateString():'',
                aggregate:vals=>null,
                style:{textAlign:'center'},
                width: 110
            }, {
                Header: 'Time',
                accessor: 'timestamp',
                Cell:row=>row.value?new Date(row.value).toLocaleTimeString():'',
                aggregate:vals=>null,
                style:{textAlign:'center'},
                width: 100
            }, {
                Header: 'B/S',
                id:'direction',
                //accessor: 'direction',
                style:{textAlign:'center'},
                accessor: (fill)=> getQtyWIthDirecion(fill.direction, fill.qty),
                Cell: row => {
                    var bs = row.value<0?'Sell':'Buy'
                    return <span className={'direction-col-'+bs}>{bs}</span>
                },
                aggregate:vals=>_.sum(vals),
                width: 90
                //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, {
                id: 'qty', // Required because our accessor is not a string
                Header: 'Qty',
                accessor: (fill)=> getQtyWIthDirecion(fill.direction, fill.qty),
                Cell: row => row.value.toLocaleString(),
                aggregate:vals=>_.sum(vals),
                style:{textAlign:'right', fontWeight:500},
                width: 130
            },{
                Header:'Price',
                id:'price',
                accessor: 'price',
                style:{textAlign:'right'},
                Cell: row => row.value?<span><span className="dollar-sign">$</span>{row.value.toFixed(2)}</span>:'',
                aggregate:vals=>null,
                width: 100
            },{
                Header:'Cost',
                id:'cost',
                accessor: (fill)=> fill.qty * fill.price,
                aggregate:vals=>_.sum(vals),
                Cell: row => <span><span className="dollar-sign">$</span>{niceNumber(row.value)}</span>,
                style:{textAlign:'right'},
                width: 130
            }
        ]

        return (
            <div style={{
                display:'flex',
                flex:1,
                alignItems:'center', // vertical
                justifyContent: 'center', //horizontal,
                flexDirection:'column',
                backgroundColor:'#182026'
                }}>
                <h1 style={{
                    width:900,
                    fontWeight:300,
                    marginBottom:-180,
                    color:'#bbbbbb',
                    paddingBottom: '10px',
                    //borderTop: '1px solid white'
                }}>Holdings</h1>

                {data.length > 0 &&
                    <div style={{
                        //backgroundColor:'#0c4064',
                        marginLeft:492,
                        //borderTopLeftRadius:25,
                        //borderTopRightRadius:25,
                        //border:'10 solid red',
                        //borderColor:'#394B59',
                        //borderWidth:2,
                        //borderStyle:'dashed',
                        borderBottomWidth:0
                        //marginTop:-150,
                        //marginBottom:-50,
                    }}>
                    <PieChart width={400} height={200} onMouseEnter={this.onPieEnter} style={{

                        //backgroundColor:'#394B59',
                        //paddingLeft:300
                    }}>
                        <Pie {...{
                            data: data,
                            cx: '50%',
                            cy: '50%',
                            labelLine: false,
                            //label: renderCustomizedLabel,
                            outerRadius: 70,
                            //fill: '#000000',
                            //style:{backgroundColor:'red'},
                            label:renderStockLabel
                        }}>
                             {
                                 data.map((entry, index) => {
                                     // console.log(entry)
                                     // console.log(holdings[entry.name])
                                     var color
                                     if (entry.name.toLowerCase() === highlightedStock){
                                         color = '#D99E0B'
                                     }
                                     else {
                                         const colorArray = holdings[entry.name]>0?this.buyColors:this.sellColors
                                         color = colorArray[index % colorArray.length]
                                     }
                                     // console.log(index)
                                     return <Cell key={'cell-key-'+index} strokeWidth={0} fill={color}/>
                                 }
                                 )}
                        </Pie>
                    </PieChart>
                    </div>
                }

                <ReactTable
                    {...{
                        style: {
                            width: 900
                        }
                        ,
                        defaultSorted:[
                            {
                                id:'stock',
                                desc:false
                            }
                        ],
                        defaultExpanded:{0:{},1:{},2:{},3:{},4:{}},
                        expanded:{0:{},1:{},2:{},3:{},4:{}},
                        data:completedOrders,
                        columns:columns,
                        minRows:0,
                        showPagination: false,
                        pivotBy:['stock'],
                        className:'-striped holdings-table',
                        getTrProps:(state, rowInfo)=>{
                            var rowClassPrefix = rowInfo.row.stock.toLowerCase() === highlightedStock?'tr-highlight ':''
                            if (rowInfo.original && highlightedOrderTime && highlightedOrderTime === rowInfo.original.timestamp){
                                rowClassPrefix += 'tr-highlight-order '
                            }
                            return {
                                className:rowClassPrefix+'rt-tr-level-'+rowInfo.level
                            }
                        },
                        getTdProps:(state, rowInfo, col)=>{
                            if (col.id === 'direction'){
                                var className = rowInfo.row.qty<0?'td-direction-sell':'td-direction-buy'
                                return {
                                    className:className
                                }
                            }
                            return {}
                        }
                    }}
                >

                </ReactTable>
            </div>
        )
    }
}