import React, { Component } from 'react';
import {View, ViewPropTypes, Text, StyleSheet, Image} from 'react-native';

export class Cell extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        borderStyle: ViewPropTypes.style
    };

    render() {
        const { data, width, height, flex, style, textStyle, borderStyle, ...props } = this.props;
        const textDom = React.isValidElement(data) ? (
            data
        ) : (
            <View style={{width:40}}>
            <Text style={[textStyle, styles.text]} {...props} numberOfLines={2}>
                {data}
            </Text>
            </View>
        );
        const borderTopWidth = (borderStyle && borderStyle.borderWidth) || 1;
        const borderRightWidth = borderTopWidth;
        const borderColor = (borderStyle && borderStyle.borderColor) || '#000';

        return (
            <View
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
                ]}
            >
                {textDom}
                <Image
                    resizeMode={'contain'}
                    style={{height:15,width:15,tintColor:'white'}}
                    source={require('../../../icons/filter.png')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cell: { justifyContent: 'center' },
    text: { backgroundColor: 'transparent' }
});
