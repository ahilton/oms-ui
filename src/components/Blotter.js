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


    buyColors = ['#2B95D6', '#4580E6', '#9179F2', '#A854A8', '#F5498B']
    sellColors = ['#2B95D6', '#4580E6', '#9179F2', '#A854A8', '#F5498B']

    render() {
        const {completedOrders, stockDetails, stickySelect} = this.props
        const highlightedStock = stickySelect &&
                                    stickySelect.lastOrderHighlight &&
                                    stickySelect.lastOrderHighlight.stock?
            stickySelect.lastOrderHighlight.stock.toLowerCase():null
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
            return data[index].name+': '+data[index].value.toLocaleString()
        };

        const columns = [
            {
                Header: 'Code',
                id: 'code',
                accessor: o=>stockDetails[o.stock.toLowerCase()].code,
                aggregate:vals=>_.uniq(vals),
                style:{textAlign:'center'}

            }, {
                Header: 'Stock',
                accessor: 'stock',
                width: 130
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
                //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
            }, {
                id: 'qty', // Required because our accessor is not a string
                Header: 'Qty',
                accessor: (fill)=> getQtyWIthDirecion(fill.direction, fill.qty),
                Cell: row => row.value.toLocaleString(),
                aggregate:vals=>_.sum(vals),
                style:{textAlign:'right'},
                width: 150
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

                {data.length > 0 &&
                    <PieChart width={600} height={250} onMouseEnter={this.onPieEnter} style={{
                        marginTop:-150,
                        marginBottom:-50,
                    }}>
                        <Pie {...{
                            data: data,
                            cx: '50%',
                            cy: '50%',
                            labelLine: false,
                            //label: renderCustomizedLabel,
                            outerRadius: 60,
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
                                     return <Cell strokeWidth={0} fill={color}/>
                                 }
                                 )}
                        </Pie>
                    </PieChart>
                }
                <h1 style={{
                    width:600,
                    fontWeight:400,
                    marginBottom:20,
                    color:'#A7B6C2'
                }}>Holdings</h1>
                <ReactTable
                    {...{
                        style: {
                            width: 600
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
                            const rowClassPrefix = rowInfo.row.stock.toLowerCase() === highlightedStock?'tr-highlight ':''
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