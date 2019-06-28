/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-25
 */

import React from 'react';
import {Dimensions, Image,Text, TouchableHighlight, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import PropTypes from 'prop-types';
import base from '../base'
const {height, width} = Dimensions.get('screen');
const btnHeight = 50;
const bufferMargin = 20;


export default class FloatingActionButton extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

    }

    static propTypes = {
        height: PropTypes.number,
        width: PropTypes.number,
        btnBackground: PropTypes.string,
        onBtnClick: PropTypes.func.isRequired,
        marginTop: PropTypes.number,
        imgSrc: PropTypes.string
    }

    static defaultProps = {
        height: 50,
        width: 50,
        marginTop:btnHeight+bufferMargin+wp(105),
        btnBackground: base.theme.colors.primary,
        imgSrc: require('../../icons/plus_white.png')
    };


    render() {

        let btnPosition = this.props.marginTop;
        let imageSrc = this.props.imgSrc;

        return (
            <View style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                zIndex: 10,
                marginTop: btnPosition,
                marginRight: 10
            }}>
                <TouchableHighlight
                    style={{position: 'relative'}}
                    underlayColor={'transparent'}
                    onPress={this.onBtnClick.bind(this)}>
                    <View style={{
                        width: this.props.width,
                        height: this.props.height,
                        borderRadius: 25,
                        alignSelf: 'flex-end',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: this.props.btnBackground,
                        marginRight: 10,
                    }}>
                        <Image
                            style={{
                                width: 100, height: 100, justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center', marginBottom: 2
                            }}
                            resizeMode={'center'}
                            source={imageSrc}
                        />
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    onBtnClick() {
        console.log(this.props.onBtnClick)
        if (this.props.onBtnClick !== undefined) {
            this.props.onBtnClick()
        }
    }

}