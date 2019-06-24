
import React,{Component, View, Text} from 'react-native';
import Style from './Style'
import base from '../../../base'

export default class Dashboard extends Component {


    constructor(props){
        super(props)
    }

    render(){
        <View style={Style.body}>

            <Text>{base.utils.strings.appName}</Text>

        </View>
    }
}