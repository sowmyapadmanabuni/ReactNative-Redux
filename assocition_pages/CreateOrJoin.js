import React from 'react';
import { View, Image, Text, StyleSheet, AppState, TouchableOpacity } from 'react-native';
import Mybutton from '../pages/components/Mybutton';
import { Fonts } from '../pages/src/utils/Fonts';
import {connect} from 'react-redux';
import { Card, CardItem, Form, Item, Input, Icon } from "native-base"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";


class CreateOrJoin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
          <View
              style={{ width: '100%', height: '75%', alignContent: 'flex-end' }}>
            <View style={styles.welcomemadan}>
              <Text style={{fontSize: hp('3.5%'), color:'#ff8c00'}}>Welcome {this.props.MyFirstName}</Text>
            </View>
            <View style={{margin:hp('1.5%')}}>
              <Text style={styles.thereisnorecordofthisnum} >There is no record with this mobile number.</Text>
            </View>
            <View style={{margin:hp('1.5%')}}>
              <Text style={styles.thereisnorecordofthisnum} >
                Please proceed with by Joining Association(join an existing association)</Text>
                 {/* or Enroll Association (Onboard your current association on OyeSpace) */}
            </View>

           {/* <View style={{ marginTop: 30, justifyContent:'center', alignItems:'center' }}>

              <Card style={{width:hp('50%'), justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginLeft: 35,
                      marginRight: 35, padding: 10,
                    }}
                    onPress={() => this.props.navigation.navigate('CreateAssnScreen')}>

                  <Image source={require('../pages/assets/images/icons8-create-26.png')}
                         style={{ height: 30, width: 30, margin: 10, alignItems: "flex-end", }} />

                  <Text style={{ margin: 10, alignItems: "flex-end",  fontSize: 17 }}>
                    Enrol Association </Text>

                     <Image source={require('../pages/assets/images/line.png')}
                          style={{height: 30, width: 10,margin: 10, alignItems: "flex-end", }} />

                  <Image source={require('../pages/assets/images/skip-track.png')}
                         style={{ height: 15, width: 10, marginLeft: 10, alignItems: "flex-end", }} />
                </TouchableOpacity>

              </Card>
    </View>*/}
            <View style={{justifyContent:'center', alignItems:'center' }}>
              <Card style={{width:hp('50%'), justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginLeft: 35,
                      marginRight: 35, padding: 10,
                    }}
                    onPress={() => this.props.navigation.navigate('City')}>

                  <Image source={require('../pages/assets/images/icons8-add-user-group-man-man-24.png')}
                         style={{ height: 30, width: 30, margin: 10, alignItems: "flex-end", }} />
                  <Text style={{ margin: 10, alignItems: "flex-end",  fontSize: 17 }}>
                    Join Association    </Text>

                  {/*   <Image source={require('../pages/assets/images/line.png')}
                          style={{height: 30, width: 10,marginLeft: 32, alignItems: "flex-end", }} /> */}

                  <Image source={require('../pages/assets/images/skip-track.png')}
                         style={{ height: 15, width: 10, marginLeft: 20, alignItems: "flex-end", }} />

                </TouchableOpacity>

              </Card>

            </View>
            {/* <TouchableOpacity
            style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', margin: 5, marginLeft: 35,
              marginRight: 35,
            }}
            onPress={this.deleteUser.bind(this)}>
            <Image source={require('../pages/assets/images/logout.png')}
              style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            <Text style={{ fontSize: 12, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Log Out</Text>
          </TouchableOpacity> */}

          </View>
          {/* <Image
          source={require('../pages/assets/images/building_complex.png')}
          style={{ width: '100%', height: '25%' }} /> */}

        </View>
    );
  }
}
const styles = StyleSheet.create({
  welcomemadan: {
    color: '#ff8c00',marginTop:hp('1%'), alignItems:'center'
  },
  thereisnorecordofthisnum: {
    alignItems:'center', marginBottom:hp('1%'),
    color: '#f00',  fontSize: hp('2.4%'),
  },
})

const mapStateToProps = state => {
  return {
    MyFirstName: state.UserReducer.MyFirstName,
    MyLastName: state.UserReducer.MyLastName,
    MyEmail: state.UserReducer.MyEmail,
    MyMobileNumber: state.UserReducer.MyMobileNumber,
    MyISDCode: state.UserReducer.MyISDCode,

    joinedAssociations: state.AppReducer.joinedAssociations,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID
  };
};

export default connect(
    mapStateToProps
)(CreateOrJoin);

