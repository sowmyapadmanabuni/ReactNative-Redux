import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert,Image } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { Button } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

export default class ExampleFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Head", "Head2", "Head3", "Head4"],
      tableData: [
        ["1", "2", "3", "4"],
        ["a", "b", "c", "d"],
        ["1", "2", "3", "4"],
        ["a", "b", "c", "d"]
      ]
    };
  }

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity
        onPress={() => {
          this.props.removeVehicle(index);
        }}
      >
        <View style={styles.btn}>
          {/* <Text style={styles.btnText}>Remove</Text> */}
          <Image style={{width:hp("3%"),height:hp("3%"),alignContent:'center',justifyContent:"center",marginLeft:hp("2%")}} source={require('../icons/delete.png')} />
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <Table borderStyle={{ borderColor: "#DCDCDC" }}>
          <Row
            data={this.props.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {this.props.tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellIndex === 2 ? element(cellData, index) : cellData}
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#E8E8E8" },
  text: { margin: 6 },
  row: { flexDirection: "row", },
  btn: { width: hp("10%"), height: hp("3%"), borderRadius: 2,marginLeft:hp("2%") },
  btnText: { textAlign: "center", color: "#fff" }
});