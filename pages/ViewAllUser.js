/*Screen to view all the user*/
import React from 'react';
import { ListView, Text, View } from 'react-native';

export default class ViewAllUser extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    
  }

   innsert(user_name,user_contact,user_address){
    
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
