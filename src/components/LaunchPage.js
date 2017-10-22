import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";

import ReactLoading from 'react-loading';


export default class LaunchPage extends Component {

    render() {

        return (
            <Flex wrap style={{
                height:'100%',
                backgroundColor:Colors.BLUE3,
                flex:1,
                alignItems:'center', // vertical
                justifyContent: 'center', //horizontal,
                flexDirection:'column'
            }}>
                <div style={{
                    //fontFamily:'HelveticaNeue-Light',
                    fontSize:80,
                    fontWeight:400,
                    color:Colors.WHITE,
                }}
                >A.I. Order Platform</div>
                <div style={{
                    fontFamily:'HelveticaNeue-Light',
                    fontSize:45,
                    marginBottom:60,
                    color:Colors.BLUE5,
                    fontVariant:'small-caps',
                    letterSpacing: 3
                }}
                >bank to the <span style={{}}>future</span> </div>
                <ReactLoading type={'bubbles'} color={Colors.BLUE5} height='100' width='100' />

            </Flex>
        )
    }
}