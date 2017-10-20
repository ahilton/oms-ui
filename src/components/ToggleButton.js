import React, {Component} from 'react';

import { Colors, Icon } from "@blueprintjs/core";
import {Box, Flex} from "reflexbox";
import StockCard from "./StockCard";

export default class ToggleButton extends Component {

    render() {
        const {handleClick, iconName, style} = this.props
        return (
            <a role="button" className=""  style={style} tabIndex="0">
                <Icon iconName={iconName} iconSize="inherit" onClick={handleClick} style={{fontSize:50}}/>
            </a>
        )
    }
}