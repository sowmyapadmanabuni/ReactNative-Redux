import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import CardViewStyles from '../cardView/CardViewStyles'
import base from "../../base";

class CardView extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    static propTypes = {
        height: PropTypes.any,
        width: PropTypes.any,
        borderRadius: PropTypes.number,
        backgroundColor: PropTypes.string,
        cardText: PropTypes.string,
        cardCount: PropTypes.number,
        cardIcon: PropTypes.any,
        cardType: PropTypes.oneOf(['default', 'normal',]).isRequired,
        onCardClick: PropTypes.func,
        elevation: PropTypes.number,
        disabled: PropTypes.bool,
        marginTop: PropTypes.number,
        marginLeft: PropTypes.number,
        marginRight: PropTypes.number,
        marginBottom: PropTypes.number,
        iconHeight:PropTypes.any,
        iconWidth:PropTypes.any,
        iconBorderRadius:PropTypes.number,
        textWeight:PropTypes.string,
        textFontSize:PropTypes.number
    }

    static defaultProps = {
        height: '45%',
        width: '45%',
        borderRadius: 10,
        backgroundColor: base.theme.colors.white,
        cardText: "",
        cardCount: null,
        cardIcon: "",
        cardType: 'default',
        elevation: 5,
        disabled: false,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        marginBottom: null,
        iconHeight:20,
        iconWidth:20,
        iconBorderRadius:0,
        textWeight:'normal',
        textFontSize:10
    }


    render() {
        let cardStyle = CardViewStyles.defaultCard;
        let imgSrc = (this.props.cardIcon);
        switch (this.props.cardType) {
            case 'normal':
                cardStyle = CardViewStyles.normalCard;
                break;
            case 'default':
                cardStyle = CardViewStyles.defaultCard;
                break;
        }
        return (
            <TouchableOpacity style={[cardStyle, {
                height: this.props.height,
                width: this.props.width,
                borderRadius: this.props.borderRadius,
                marginTop: this.props.marginTop,
                marginLeft: this.props.marginLeft,
                marginRight: this.props.marginRight,
                marginBottom: this.props.marginBottom,
                backgroundColor: this.props.backgroundColor,
                ...this.props.style
            }]}
                              onPress={this.onCardClick.bind(this)}
                              disabled={this.props.disabled}>
                <View style={CardViewStyles.subCardView}>
                    <Image style={[CardViewStyles.imageStyles,{height:this.props.iconHeight,width:this.props.iconWidth,
                        borderRadius:this.props.iconBorderRadius,...this.props.style}]}
                           source={imgSrc}>
                    </Image>
                    <View style={[CardViewStyles.subView]}>
                        <Text style={CardViewStyles.count}>
                            {this.props.cardCount}
                        </Text>
                        <Text style={[CardViewStyles.cardText,{fontWeight:this.props.textWeight,fontSize:this.props.textFontSize,

                        }]}
                              numberOfLines={2}>
                            {this.props.cardText}
                        </Text>

                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    onCardClick() {
        if (this.props.onCardClick) {
            this.props.onCardClick()
        }
    }


}



export default CardView;
