import {Platform, StyleSheet} from "react-native";
import base from "../../base";


const HeaderStyles = StyleSheet.create({
    container: {
        height: 64,
        width: '100%',
        backgroundColor: base.theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: base.theme.colors.primary,
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    subContainerLeft: {
        height: 60,
        width: "30%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft:16
    },
    subContainerRight: {
        height: 60,
        width: "20%",
        backgroundColor: base.theme.colors.white,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: 20

    },
    textContainer: {
        marginLeft: 5,
    },
    residentName: {
        fontSize: 14,
        color: base.theme.colors.darkgrey,
        fontWeight:'600'
    },
    imageStyles: {
        alignSelf:'center',
        height: 32,
        width: 32,
        borderRadius: 32 / 2
    },
    logoStyles: {
        height: 25,
        width: 25,
        alignSelf: 'center'
    },
    statusText: {
        fontSize: 10,
        color: base.theme.colors.mediumGrey,
    },
    appLogoStyles: {
        height: 80,
        width: 80,
        alignSelf: 'center'
    }


});

export default HeaderStyles;