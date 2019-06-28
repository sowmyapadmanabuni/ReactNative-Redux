import {StyleSheet, Platform} from 'react-native';
import base from '../../../src/base'


const CardViewStyles = StyleSheet.create({
    defaultCard: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderColor: base.theme.colors.white,
        shadowColor: base.theme.colors.darkgrey,
        shadowOffset: {width: 0, height: Platform.OS==='ios'?3:2},
        shadowOpacity: Platform.OS==='ios'?0.3:0.8,
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
        height: 28,
        width: 28,
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
    }

});

export default CardViewStyles;