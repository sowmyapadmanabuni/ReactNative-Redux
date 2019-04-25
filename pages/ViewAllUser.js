/*Screen to view all the user*/
import React from 'react';
import { ListView, Text, View } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

export default class ViewAllUser extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM OyeUnit', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          console.log('Results UnitID', results.rows.item(i).UnitID+' '+results.rows.item(i).UnitName);
        //  this.innsert(results.rows.item(i).UnitID,results.rows.item(i).UnitName,results.rows.item(i).Type);
        }
        this.setState({
          dataSource: ds.cloneWithRows(temp),
        });
      });
    });
  }

   innsert(user_name,user_contact,user_address){
    db.transaction(function(tx) {
      tx.executeSql(
        'INSERT INTO OyeUnit (UnitID, AssociationID, UnitName, Type) VALUES (?,?,?,?)',
        [user_name,2, user_contact, user_address],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are registered successfully',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                    that.props.navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else {
            alert('Registration Failed');
          }
        }
      );
    });
  }
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.5, width: '100%', backgroundColor: '#000' }} />
    );
  };
  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderSeparator={this.ListViewItemSeparator}
          renderRow={rowData => (
            <View style={{ backgroundColor: 'white', padding: 20 }}>
              <Text>Id: {rowData.UnitID}{global.MyVar}</Text>
              <Text>Name: {rowData.UnitName}</Text>
              <Text>Contact: {rowData.Type}</Text>
              <Text>Address: {rowData.ParkingSlotNumber}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}
