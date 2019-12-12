import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView, TextInput, SafeAreaView, TouchableHighlight,Linking
} from 'react-native';
import {heightPercentageToDP} from "react-native-responsive-screen";
import AddExpenseStyles from "./Expenses/AddExpenseStyles";
import Dropdown from "react-native-material-dropdown/src/components/dropdown";
const {height, width} = Dimensions.get('screen');
import {connect} from "react-redux";


class Accounting extends Component {
  constructor(props) {
    super(props);
    this.state={

    }
  }

  componentWillMount() {

  }



  render() {
    return(
        <SafeAreaView style={AddExpenseStyles.safeArea}>
          <View style={AddExpenseStyles.headerView}>
            <Text style={AddExpenseStyles.headerText}>Add Expense</Text>
          </View>
          <View style={AddExpenseStyles.subHeadView}>
            <Text style={AddExpenseStyles.subHeadText}>Expense Details</Text>
          </View>
          <ScrollView style={AddExpenseStyles.mainContainer}
                      showsVerticalScrollIndicator={false}>
          </ScrollView>

        </SafeAreaView>
    )
  }


}

const mapStateToProps = state => {
  return {
    dashBoardReducer: state.DashboardReducer,
    userReducer: state.UserReducer,
  };
};
export default connect(mapStateToProps)(Accounting)
