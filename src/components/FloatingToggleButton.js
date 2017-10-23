import React, {Component} from 'react';
import ToggleButton from "./ToggleButton";

export default class FloatingToggleButton extends Component {

    render() {
        const {fixedStyle, iconName, handleClick, color} = this.props
        const buttonColor = color?color:'black'
        return (
            <div style={{
                ...fixedStyle,
                width:120, height:120,
                position:'fixed',
                display:'flex',
                alignItems:'center', // vertical
                justifyContent: 'center', //horizontal,
            }}>
                <ToggleButton {...{style:{color:buttonColor, opacity:0.2}, iconName:iconName, handleClick:handleClick}}/>
            </div>
        )
    }
}