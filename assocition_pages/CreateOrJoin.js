import React from 'react';
import { View, Image, Text, StyleSheet, AppState, TouchableOpacity } from 'react-native';
import Mybutton from '../pages/components/Mybutton';
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts';

var db = openDatabase({ name: global.DB_NAME });

export default class CreateOrJoin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View
          style={{ width: '100%', height: '75%', alignContent: 'flex-end' }}>
          <Text style={styles.welcomemadan}>Welcome {global.MyFirstName},</Text>
          <Text style={styles.thereisnorecordofthisnum} >There is no record of this number with us.
            Please proceed with enrolling your association or joining currently listed associations.</Text>
          <View style={{ marginTop: 30, }}>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginLeft: 35,
                marginRight: 35, padding: 10, backgroundColor: '#f2f2f2',
              }}
              onPress={() => this.props.navigation.navigate('CreateAssnScreen')}>

              <Image source={require('../pages/assets/images/icons8-create-26.png')}
                style={{ height: 30, width: 30, margin: 10, alignItems: "flex-end", }} />

              <Text style={{ margin: 10, alignItems: "flex-end",  fontSize: 17 }}>
                Create Association </Text>

              {/*   <Image source={require('../pages/assets/images/line.png')}
                          style={{height: 30, width: 10,margin: 10, alignItems: "flex-end", }} />
 */}
              <Image source={require('../pages/assets/images/skip-track.png')}
                style={{ height: 15, width: 10, marginLeft: 10, alignItems: "flex-end", }} />
            </TouchableOpacity>

          </View>
          <View>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginLeft: 35,
                marginRight: 35, padding: 10, backgroundColor: '#f2f2f2',
              }}
              onPress={() => this.props.navigation.navigate('AssnListScreen')}>

              <Image source={require('../pages/assets/images/icons8-add-user-group-man-man-24.png')}
                style={{ height: 30, width: 30, margin: 10, alignItems: "flex-end", }} />
              <Text style={{ margin: 10, alignItems: "flex-end",  fontSize: 17 }}>
                Join Association    </Text>

              {/*   <Image source={require('../pages/assets/images/line.png')}
                          style={{height: 30, width: 10,marginLeft: 32, alignItems: "flex-end", }} /> */}

              <Image source={require('../pages/assets/images/skip-track.png')}
                style={{ height: 15, width: 10, marginLeft: 20, alignItems: "flex-end", }} />

            </TouchableOpacity>

          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', margin: 5, marginLeft: 35,
              marginRight: 35,
            }}
            onPress={this.deleteUser.bind(this)}  /*Products is navigation name*/>
            <Image source={require('../pages/assets/images/logout.png')}
              style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            <Text style={{ fontSize: 12, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Log Out</Text>
          </TouchableOpacity>

        </View>
        <Image
          source={require('../pages/assets/images/building_complex.png')}
          style={{ width: '100%', height: '25%' }} />

      </View>
    );
  }

  deleteUser = () => {
    var that = this;
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  OTPVerification ',
        [],
        (tx, results) => {
          console.log('OTPVerification DELETE', results.rowsAffected);

        }
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  Account ',
        [],
        (tx, results) => {
          console.log('Account DELETE', results.rowsAffected);
          if (results.rowsAffected > 0) {
            that.props.navigation.navigate('SplashScreen');
          } else {
            alert('Logged Out Failed');
          }
        }
      );
    });
  };
}
const styles = StyleSheet.create({
  welcomemadan: {
    marginLeft: 25, color: '#000', fontSize: 19, marginTop: 20//lineheight: '23px',
  },
  thereisnorecordofthisnum: {
    marginLeft: 25, marginRight: 25, textAlign: 'justify', lineHeight: 25,
    color: '#f00',  fontSize: 17, //lineheight: '23px',
  },
})
