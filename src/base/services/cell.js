import React, { Component } from 'react';
import {View, ViewPropTypes, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
import PropTypes from "prop-types";

export class Cell extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        borderStyle: ViewPropTypes.style,
        onClickIcon:PropTypes.func
    };

    render() {
        const { data, width, height, flex, style, textStyle, borderStyle , onClickIcon, ...props } = this.props;
        const textDom = React.isValidElement(data) ? (
            data
        ) : (
            <View style={{width:50,}}>
            <Text style={[textStyle, styles.text,]} {...props} numberOfLines={2}>
                {data[0]}
            </Text>
            </View>
        );
        const borderTopWidth = (borderStyle && borderStyle.borderWidth) || 1;
        const borderRightWidth = borderTopWidth;
        const borderColor = (borderStyle && borderStyle.borderColor) || '#000';

        return (
            <TouchableOpacity
                style={[
                    {
                        borderTopWidth,
                        borderRightWidth,
                        borderColor,
                        flexDirection:'row',
                        alignItems:'center'
                    },
                    styles.cell,
                    width && { width },
                    height && { height },
                    flex && { flex },
                    !width && !flex && !height && !style && { flex: 1 },
                    style
                ]} onPress={this.onClickIcon.bind(this)} disabled={!data[1]}{...props}
            >
                {textDom}

                {data[1]?
                <Image
                    resizeMode={'contain'}
                    style={{height:15,width:15,tintColor:'white'}}
                    source={require('../../../icons/sort.png')}/>
                    :<View/>}
            </TouchableOpacity>


        );

    }

    onClickIcon(){
         if(this.props.onClickIcon()){
             this.props.onClickIcon()
         }
    }



}

const styles = StyleSheet.create({
    cell: { justifyContent: 'center' },
    text: { backgroundColor: 'transparent' }
});
