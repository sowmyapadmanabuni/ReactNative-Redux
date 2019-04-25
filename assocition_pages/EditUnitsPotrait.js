import React, { Component } from 'react';
import {
  AppRegistry, View, Text, TextInput, StyleSheet, Button, Card, ActivityIndicator,
  Image, TouchableOpacity, alertMessage, Alert, ScrollView
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker'
import PhoneInput from "react-native-phone-input";
import { openDatabase } from 'react-native-sqlite-storage';
import { DatePickerDialog } from 'react-native-datepicker-dialog'

var db = openDatabase({ name: global.DB_NAME });

const options = {
  title: 'Select a Photo',
  takePhotoButton: 'Take a Photo',
  chooseFromLibraryButton: 'Choose From Library',
  quality: 1
};

export default class EditFamilyMember extends Component {

  state = {
    stDimension: '',
    stUnitName: '',
    stUnitType: '',
    stOpenBal: '',
    stCurrBal: '',
    stOcStat: '',
    stOcSDate: '',
    stOwnStat: '',
    stSldDate: '',
    stCalType: ''
  }

  funcDimension = (dimen) => {
    this.setState({ stDimension: dimen })
  }
  funcOpenBal = (openBal) => {
    this.setState({ stOpenBal: openBal })
  }

  funcUnitType= (unitTyp) => {
    this.setState({ stUnitType: unitTyp })
  }

  funcOccStat= (occStatus) => {
    this.setState({ stOcStat: occStatus })
  }

  funcOwnStat= (ownStatus) => {
    this.setState({ stOwnStat: ownStatus })
  }

  funcCalType= (calculatnType) => {
    this.setState({ stCalType: calculatnType })
  }

   // stOcSDate: '',
   // stSldDate: '',
   
  constructor() {
    super();
    this.state = {
      imageSource: null,
      data: null,
      valid: "",
      type: "",
      value: "",
      isLoading: true,
      PickerValueHolder: '',
      imgPath: "",
    };

    this.renderInfo = this.renderInfo.bind(this);

  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log('EditunitsPotrait fmid start ', params.unUnitID)
    console.log('EditunitsPotrait componentdidmount')
    //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+params.id
    //http://localhost:54400/champ/api/v1/Unit/GetUnitListByUnitID/{UnitID}
    const url = 'http://' + global.oyeURL + '/champ/api/v1/Unit/GetUnitListByUnitID/' + params.unUnitID
    console.log('EditunitsPotrait '+url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('EditunitsPotrait responseJson ', responseJson);

        this.setState({
          isLoading: false
        })
        if (responseJson.success) {

          //{{ unUnitID: 11,    unUniName: 'fgh',  unUniIden: '560101', unUniType: '', unOpenBal: 0,
          //  unCurrBal: 0,    unOcStat: '',  unOcSDate: '0001-01-01T00:00:00', unOwnStat: '', unSldDate: '0001-01-01T00:00:00',
          //  unDimens: '',    unCalType: '',  flFloorID: 0, blBlockID: 0,   asAssnID: 6,

          console.log('Results oyeUnits', responseJson.data.unit.unUniType + ' ' + responseJson.data.unit.unUniName);

          this.setState({
            stDimension: responseJson.data.unit.unDimens,
            stUnitName: responseJson.data.unit.unUniName,
            stUnitType: responseJson.data.unit.unUniType,
            stOpenBal: responseJson.data.unit.unOpenBal + '',
            stCurrBal: responseJson.data.unit.unCurrBal,
            stOcStat: responseJson.data.unit.unOcStat,
            stOcSDate: responseJson.data.unit.unOcSDate,
            stOwnStat: responseJson.data.unit.unOwnStat,
            stSldDate: responseJson.data.unit.unSldDate,
            stCalType: responseJson.data.unit.unCalType,
          });


        } else {
          console.log('EditunitsPotrait failurre')
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        })
        console.log('EditunitsPotrait err ', error)

      })
  }

  AddMember = (first, last, mobile, relation, OwnStatus,calculatnType) => {

    /* this.setState({
        valid: this.phone.isValidNumber(),
        type: this.phone.getNumberType(),
        value: this.phone.getValue()
    });
*/
    const { params } = this.props.navigation.state;
    console.log('fmid start ', params.unUnitID)
    var result = this.Validate(first, last, mobile, relation)
    if (result === true) {
      //let number = this.phone.getValue() + mobile;
      //stDimension: '',    stUnitName: '',    stUnitType: '',    stOpenBal: '',    stCurrBal: '',
      // stOcStat: '',    stOcSDate: '',    stOwnStat: '',    stSldDate: '',    stCalType: ''

      member = {
        "UNUniType": this.state.stUnitType,
        "UNOpenBal": this.state.stOpenBal,
        "UNCurrBal": this.state.stCurrBal,
        "UNOcStat": this.state.stOcStat,
        "UNOcSDate": this.state.stOcSDate,
        "UNOwnStat": this.state.stOwnStat,
        "UNSldDate": this.state.stSldDate,
        "UNDimens": this.state.stDimension,
        "UNCalType": this.state.stCalType,
        "FLFloorID": 1,
        "BLBlockID": 1,
        "UNUnitID": params.unUnitID
      }

      /* "{
	""UNUniType"" : ""FLAT"",	""UNOpenBal""	: ""12.3"",	""UNCurrBal""	: ""25.12"",
	""UNOcStat""	: ""Active"",	""UNOcSDate"" : ""2018-02-25"",	""UNOwnStat"" : ""dsf"",
	""UNSldDate""	: ""2018-02-02"",	""UNDimens""  : ""2"",	""UNCalType""	: ""df"",
	""FLFloorID"" : 1,	""BLBlockID"" : 1,	""UNUnitID""  : 8
}" */
      const url = 'http://' + global.oyeURL + '/champ/api/v1/Unit/UpdateUnitDetails'
      //  const url = 'http://localhost:54400/champ/api/v1/Unit/UpdateUnitDetails'

      console.log('EditunitsPotrait req', JSON.stringify(member));
      fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
          },
          body: JSON.stringify(member)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('EditunitsPotrait response', responseJson);
          if (responseJson.success) {
            //  alert('Member Added successfully !')
             this.props.navigation.navigate('Unit', { id: params.asAssnID });
          } else {
            //console.log('hiii', failed);
            alert('Failed to Update Unit !')
          }
          console.log('suvarna', 'hi');
        })
        .catch((error) => {
          console.error(error);
          alert('Caught error in Update Unit')
        });
    } else {
      console.log('Validation', "Failed");
    }

  }

  Validate(first, last, mobile, relation) {

    const reg = /^[0]?[6789]\d{9}$/;
    return true;
    if (first == '' || first == undefined) {
      alert('Enter First Name')
      return false
    } else if (last == '' || last == undefined) {
      alert('Enter Last Name')
      return false
      // } else if (reg.test(mobile) === false || mobile == undefined) {
      //   alert('Enter valid Mobile Number')
      //   return false;
    } else if (relation == '' || relation == undefined) {
      alert('Select Relation')
      return false
    }
    return true

  }

  GetPickerSelectedItemValue = () => {
    Alert.alert(this.state.PickerValueHolder);
  }

  renderInfo() {

    if (this.state.value) {
      return (
        <View style={styles.info}>
          <Text> Is Valid:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.valid.toString()}
            </Text>
          </Text>
          <Text> Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
          </Text>
          <Text>   Value:{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
          </Text>
        </View>
      );
    }
  }

  render() {

    let dpOwnershipStatus = [{ value: 'Sold', }, { value: 'Unsold', }]

    let dpOccupancyStatus = [{ value: 'Self Occupied', }, { value: 'Tenant Occupied', }, { value: 'Vacant', }]

    let dpUnitType = [{ value: 'Vacant Plot', }, { value: 'Flat', }, { value: 'Villa', }]

    let dpRateType = [{ value: 'Flat Rate Value', }, { value: 'Dimension Based', }]

    let dpVehType = [{ value: 'Two Wheeler', }, { value: 'Three Wheeler', }, { value: 'Four Wheeler', }]

    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>

      );
    }

    return (

      <View style={styles.container}>
        <ScrollView>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 1, flexDirection: 'row', marginLeft: '2%', marginTop: 5, height: 40, }}>

              <Text style={{ flex: 1, alignSelf: 'center' }}>Dimension </Text>
              <TextInput style={{
                flex: 1, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
                borderWidth: 1.5, borderRadius: 2,
              }}
                underlineColorAndroid="transparent"
                placeholder="Dimension"
                placeholderTextColor="#828282"
                autoCapitalize="none"
                keyboardType={'numeric'}
                maxLength={10}
                value={this.state.stDimension}
                onChangeText={this.funcDimension} />
              <Text style={{ flex: 1, alignSelf: 'center' }}>(in Sqft )</Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', marginLeft: '2%', marginTop: 5, height: 40, }}>

              <Text style={{ flex: 1, alignSelf: 'center' }}> Opening Due Balance </Text>
              <TextInput style={{
                flex: 1, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
                borderWidth: 1.5, borderRadius: 2,
              }}
                underlineColorAndroid="transparent"
                placeholder="Opening Due Balance"
                placeholderTextColor="#828282"
                autoCapitalize="none"
                keyboardType={'numeric'}
                maxLength={10}
                value={this.state.stOpenBal}
                onChangeText={this.funcOpenBal} />
            </View>

          {/*   <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>

              <Text style={{ marginLeft: 15, color: 'black' }}>
                Opening Due Balance as on
</Text>
               <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
<TouchableOpacity onPress={this.onDOBPress.bind(this)} >
  <View style={styles.datePickerBox}>
    <Text style={styles.datePickerText}>    </Text>
  </View>
</TouchableOpacity> 

            </View> */}

            <View style={{ flex: 2, flexDirection: 'row', }}>
              <View style={{ flex: 1, marginLeft: 5, paddingRight: 5 }}>
                <Dropdown label='Select Unit Type'
                  data={dpUnitType}
                  value={this.state.stUnitType}
                  onChangeText={this.funcUnitType} />
              </View>
              <View style={{ flex: 1, marginLeft: 5, paddingRight: 5 }}>
                <Dropdown label='Select Rate Type'
                  data={dpRateType}
                  value={this.state.stCalType}
                  onChangeText={this.funcCalType} />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 5, paddingRight: 5 }}>
              <Dropdown label='Select Occupancy Status'
                data={dpOccupancyStatus}
                value={this.state.stOcStat}
                onChangeText={this.funcOccStat} />
            </View>
            <View style={{ flex: 2, flexDirection: 'row', }}>
              <View style={{ flex: 1, marginLeft: 5, paddingRight: 5 }}>
                <Dropdown label='Select Ownership Status'
                  data={dpOwnershipStatus}
                  value={this.state.stOwnStat}
                  onChangeText={this.funcOwnStat} />
              </View>
            </View>
            <TouchableOpacity style={styles.rectangle}
              onPress={this.AddMember.bind(this, this.state.stDimension, this.state.stOpenBal,
                this.state.stUnitType, this.state.stOcStat, this.state.stOwnStat,this.state.stCalType)}  >
              <Text style={{ fontSize: 16, padding: 3, alignSelf: 'center', color: 'orange' }}>
                Update </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: { justifyContent: 'center', backgroundColor: "#fff", height: '100%', width: '100%', },

  rectangle: {
    backgroundColor: 'white', padding: 10, borderColor: 'orange',
    margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center',
  },
  rectangle1: {
    backgroundColor: 'white', padding: 5, borderColor: 'orange',
    margin: 5, borderRadius: 2, borderWidth: 1, alignContent: 'center',
  },
  input: {
    marginLeft: 15, marginRight: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2',
    backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2, flexDirection: 'row',
  },

  input_two: {
    marginLeft: 15, marginTop: 15, height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2',
    borderWidth: 1.5, borderRadius: 2,
  },

  imagee: { height: 14, width: 14, margin: 10, },

  text: { fontSize: 13, color: 'black', justifyContent: 'center', },

  submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },

  submitButtonText: { color: '#FA9917' }

})

