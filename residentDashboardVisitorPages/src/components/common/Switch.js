import React from 'react'
import {StyleSheet, Switch, View} from 'react-native'

export default SwitchExample = (props) => {
    return (
        <View style={styles.container}>
            <Switch
                onValueChange={props.toggleSwitch1}
                value={props.switch1Value}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});