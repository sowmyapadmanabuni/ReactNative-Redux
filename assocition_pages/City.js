import React, { Component } from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, TouchableOpacity,
  TouchableWithoutFeedback, Image, Dimensions, FlatList, ScrollView, Platform, Linking
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Card, CardItem, Form, Item, Button, Input, Icon } from "native-base"


export default class City extends Component {

  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [
        { key: "Agra" },
        { key: "Ahemdabad" },
        { key: "Bhopal" },
        { key: "Chennai" },
        { key: "Gurgaon" },
        { key: "Gwalior" },
        { key: "Haridwar" },
        { key: "Hyderabad" },
        { key: "Kolkata" }
      ]
    };
  }
  FlatListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#E5E5E5", marginBottom: hp('1%'), marginTop: hp('1%') }} />
    );
  };
  render() {
    return (
      <View style={styles.contaianer}>
        <SafeAreaView style={{ backgroundColor: "#ff8c00" }}>
          <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
            <View style={styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ResDashBoard")
                }}
              >
                <View
                  style={{
                    height: hp("4%"),
                    width: wp("15%"),
                    alignItems: "flex-start",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../icons/back.png")}
                    style={styles.viewDetails2}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '35%',
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={[styles.image]}
                source={require("../icons/headerLogo.png")}
              />
            </View>
            <View style={{ width: '35%' }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "#ff8c00" }} />
        </SafeAreaView>
        <ScrollView>
          <View>
            {/* <Form style={styles.formSearch}>
                  <Item style={styles.inputItem}>

                    <Input
                      marginBottom={hp("-1%")}
                      placeholder="Search for your city...."
                      pointerEvents='none'
                      // onTouchStart={() => this.props.navigation.navigate('AssnListScreen')}
                    />
                    <Icon style={styles.icon} name="search" size={14} />
                  </Item>
              </Form> */}
            <View style={{ borderWidth: 0.5, borderColor: "#E5E5E5" }} />

            <View style={{ flexDirection: 'column', backgroundColor: '#fafafa' }}>
              <View style={{ height: hp('5%'), justifyContent: 'center', marginLeft: hp('2%') }}>
                <Text style={{ fontSize: hp('2%'), fontWeight: '500' }}>Select your City</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Bangalore", id: "56" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/bengaluru.png')} />
                  <Text>Bengaluru</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Chandigarh", id: "16" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/chandigarh.png')} />
                  <Text>Chandigarh</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Delhi", id: "11" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/delhi-ncr.png')} />
                  <Text>Delhi-NCR</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Indore", id: "45" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/indore.png')} />
                  <Text>Indore</Text>
                </View>
              </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Jaipur", id: "30" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/jaipur.png')} />
                  <Text>Jaipur</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Kanpur", id: "20" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/kanpur.png')} />
                  <Text>Kanpur</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Lucknow", id: "22" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/lucknow.png')} />
                  <Text>Lucknow</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Mumbai", id: "40" })}>
                <View style={styles.card}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/mumbai.png')} />
                  <Text>Mumbai</Text>
                </View>
              </TouchableOpacity>
            </View>


            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Nagpur", id: "44" })}>
                <View style={[styles.card, { borderBottomWidth: 1 }]}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/nagpur.png')} />
                  <Text>Nagpur</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Prayagraj", id: "21" })}>
                <View style={[styles.card, { borderBottomWidth: 1 }]}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/prayagraj.png')} />
                  <Text>Prayagraj</Text>
                  <Text>(Allahabad)</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Pune", id: "41" })}>
                <View style={[styles.card, { borderBottomWidth: 1 }]}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/pune.png')} />
                  <Text>Pune</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AssnListScreen', { name: "Varanasi", id: "22" })}>
                <View style={[styles.card, { borderBottomWidth: 1 }]}>
                  <Image style={{ width: hp('5%'), height: hp('5%') }} source={require('../icons/varanasi.png')} />
                  <Text>Varanasi</Text>
                  <Text>(Benaras)</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* <View style={{ flexDirection: 'column', backgroundColor: '#fafafa' }}>
              <View style={{ height: hp('5%'), justifyContent: 'center', marginLeft: hp('2%') }}>
                <Text style={{ fontSize: hp('2%'), fontWeight: '500' }}>OTHER CITIES</Text>
              </View>
              <View style={{ borderWidth: 0.5, borderColor: "#E5E5E5" }} />
            </View>


            <FlatList
              style={{ marginTop: hp('1.5%'), marginLeft: hp('1.5%'), marginBottom: hp('4%'), marginRight: hp('1%') }}
              data={this.state.FlatListItems}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item }) =>
                <Text style={styles.item}>
                  {item.key}
                </Text>}

            /> */}
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems:'center'
              }}
            >
              <View style={{ marginTop: hp("2%") }}>
                <Button bordered warning style={styles.button1}
                onPress={() => {
                  {
                    Platform.OS === "android"
                      ? Linking.openURL(`tel:+919343121121`)
                      : Linking.openURL(`tel:+919343121121`);
                  }
                }}
                // onPress={() => this.props.navigation.navigate('City')}
                >
                  <Text>Click here to schedule a demo.</Text>
                </Button>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contaianer: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column"
  },

  viewDetails2: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: hp("3%"),
    height: hp("3%"),
    marginTop: 5
    // marginLeft: 10
  },
  button1: {
    width: hp("30%"),
    justifyContent: "center"
  },
  viewDetails1: {
    width: '30%',
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 10
  },
  viewStyle1: {
    backgroundColor: "#fff",
    height: hp("7%"),
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },

  image: {
    width: wp("24%"),
    height: hp("10%")
  },

  card: { flexDirection: 'column', width: Dimensions.get("window").width / 4, height: Dimensions.get("window").width / 3 - 30, borderTopWidth: 1, borderRightWidth: 1, borderColor: "#E5E5E5", alignItems: 'center', justifyContent: 'center' },
  formSearch: {
    marginBottom: hp("1%")
  },
  inputItem: {
    marginTop: wp("1%"),
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    //borderColor: "#909091"
    borderColor: "#000000"
  },
  icon: {
    color: "#ff8c00"
  },
});