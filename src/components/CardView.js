import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    ViewPropTypes,
    PixelRatio
} from 'react-native';
import PropTypes from 'prop-types'
import base from "../base";


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
        cardIcon: PropTypes.string,
        cardType: PropTypes.oneOf(['default', 'normal',]).isRequired,
        onCardClick: PropTypes.func,
        elevation: PropTypes.number,
        disabled: PropTypes.bool,
        marginTop: PropTypes.number,
        marginLeft: PropTypes.number,
        marginRight: PropTypes.number,
        marginBottom: PropTypes.number
    }

    static defaultProps = {
        height: '45%',
        width: '45%',
        borderRadius: 10,
        backgroundColor: "#ffffff",
        cardText: "",
        cardCount: null,
        cardIcon: "",
        cardType: 'default',
        elevation: 5,
        disabled: false,
        marginTop: null,
        marginLeft: null,
        marginRight: null,
        marginBottom: null
    }


    render() {
        console.log("Props", this.props)
        let cardStyle = styles.defaultCard;
        let imgSrc = (this.props.cardIcon);
        switch (this.props.cardType) {
            case 'normal':
                cardStyle = styles.normalCard;
                break;
            case 'default':
                cardStyle = styles.defaultCard;
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
                <View style={styles.subCardView}>
                    <Image style={styles.imageStyles}
                           source={imgSrc}>
                    </Image>
                    <View style={[styles.subView]}>
                        <Text style={styles.count}>
                            {this.props.cardCount}
                        </Text>
                        <Text style={styles.cardText}
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

const styles = StyleSheet.create({
    defaultCard: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderColor: base.theme.colors.white,
        shadowColor: base.theme.colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,

    },
    normalCard: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderColor: base.theme.colors.white,
        shadowColor: base.theme.colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,

    },
    subCardView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyles: {
        height: 20,
        width: 20,
        alignSelf: 'center',
        marginBottom: 2
    },
    subView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '65%',
    },
    count: {
        fontSize: 15,
        color: base.theme.colors.blue,
        marginRight: 5,
    },
    cardText: {
        fontSize: 10,
        color: base.theme.colors.black,
        //fontFamily:base.theme.fonts.bold
    }

})

export default CardView;
