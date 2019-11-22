import React, {Component} from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Easing,
    FlatList,
    Image,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
// import Header from "./components/common/Header.js";
import {Button, Card, CardItem} from "native-base";
import moment from "moment";
import {DatePickerDialog} from "react-native-datepicker-dialog";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
//import Share from 'react-native-share';
import ZoomImage from "react-native-zoom-image";
import {connect} from 'react-redux';
import base from "../src/base";


class ViewAllVisitorsList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            isLoading: true,
            isListEmpty: false,

            //search bar
            loading: false,
            error: null,

            //date picker
            dobText: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
            dobDate: null,

            dobText1: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
            dobDate1: null,

            totalVisitors: 0,

            isDateTimePickerVisible: false,

            switch: false,

            count: 1
        };
        this.arrayholder = [];
    }

    //Date Picker
    onDOBPress = () => {
        let dobDate = this.state.dobDate;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate: dobDate
            });
        }
        this.refs.dobDialog.open({
            date: dobDate,
            maxDate: new Date() //To restirct past dates
        });
    };

    onDOBDatePicked = date => {
        this.setState({
            dobDate: date,
            dobText: moment(date).format("YYYY-MM-DD")
        });
    };

    onDOBPress1 = () => {
        let dobDate = this.state.dobDate1;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate1: dobDate
            });
        }
        this.refs.dobDialog1.open({
            date: dobDate,
            maxDate: new Date() //To restirct past dates
        });
    };

    onDOBDatePicked1 = date => {
        this.setState({
            dobDate1: date,
            dobText1: moment(date).format("YYYY-MM-DD")
        });
    };

    searchFilterFunction = text => {
        console.log("text ",text)
        this.setState({
            value: text
        });

        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.vlfName.toUpperCase()} ${item.vlVisType.toUpperCase()} ${item.vlfName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        console.log("newData ",newData);
        this.setState({
            dataSource: newData
        });
    };

    componentDidMount() {
        base.utils.validate.checkSubscription(this.props.userReducer.SelectedAssociationID)

        this.myVisitorsGetList();
    }

    myVisitorsGetList(){
        console.log("AAAAAAAAAAA");
        console.log("---------- Call -------------"); //2019/05/02
        if (this.state.dobText1 < this.state.dobText) {
            Alert.alert("From Date should be less than To Date");

        } else {
            console.log("ELSE")
            fetch(
                `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogByDates`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
                    },
                    body: JSON.stringify({
                        "StartDate": this.state.dobText,
                        "EndDate": this.state.dobText1,
                        "ASAssnID": this.props.SelectedAssociationID,
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("responseJson",responseJson );
                    this.setState({
                        dataSource: responseJson.data.visitorlog.sort((a, b) => Date.parse(b.vldCreated) - Date.parse(a.vldCreated)),
                        isLoading: false
                    });
                    this.arrayholder = responseJson.data.visitorlog;
                    var total = 0;
                    for (var i = 0; i < this.state.dataSource.length; i++) {

                        total += this.state.dataSource[i].vlVisCnt;
                    }
                    this.setState({
                        totalVisitors: total,
                    })
                })
                .catch(error => {
                    this.setState({
                        isLoading: false
                    });
                    console.log(error);
                })
        }
    };

    renderItem = ({item}) => {
        console.log(item);
        return (
            <View style={styles.tableView}>
                <View style={styles.lineForCellView}/>
                <View style={styles.cellView}>
                    <View style={styles.containerImageView}>
                        {/* <Image
              style={styles.mainCardItemImage}
              source={{
                uri: "http://mediaupload.oyespace.com/Images/" + item.vlEntryImg
              }}
              /> */}
                        {item.vlEntryImg == "" ? (
                            <ZoomImage
                                source={require("../icons/placeholderImg.png")}
                                imgStyle={styles.mainCardItemImage}
                                duration={300}
                                enableScaling={true}
                                easingFunc={Easing.bounce}
                            />
                        ) : (
                            <ZoomImage
                                source={{
                                    uri:
                                        "http://mediaupload.oyespace.com/Images/" + item.vlEntryImg
                                }}
                                imgStyle={styles.mainCardItemImage}
                                duration={300}
                                enableScaling={true}
                                easingFunc={Easing.bounce}
                            />
                        )}
                    </View>
                    <View style={styles.textViewContainer}>
                        <Text style={styles.nameTextStyle}>
                            {item.vlfName}
                            {/* {this.state.dataSource[0].vlfName} */}
                        </Text>
                        <View style={styles.viewTextStyle}>
                            <Image
                                style={styles.viewImageStyle}
                                source={require("../icons/user.png")}
                            />
                            <Text style={styles.subNameTextStyleOne}>{item.vlVisType} </Text>
                        </View>
                        <View style={styles.viewTextStyle}>
                            <Image
                                style={styles.viewImageStyle}
                                source={require("../icons/entry_time.png")}
                            />
                            <Text style={styles.subNameTextStyleTwo}>
                                Entry: {item.vlEntryT.substring(5, 10)},
                                {item.vlEntryT.substring(11, 16)} Exit:
                                {item.vlExitT.substring(5, 10)},{item.vlExitT.substring(11, 16)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.cellEndIcons}>
                        <Card>
                            <TouchableOpacity
                                onPress={() => {
                                    {
                                        Platform.OS === "android"
                                            ? Linking.openURL(`tel:${item.vlMobile}`)
                                            : Linking.openURL(`tel:${item.vlMobile}`);
                                    }
                                }}
                            >
                                <CardItem bordered>
                                    <Image
                                        style={styles.smallCardItemImage}
                                        source={require("../icons/call.png")}
                                    />
                                </CardItem>
                            </TouchableOpacity>
                        </Card>
                    </View>
                </View>
                <View style={styles.lineForCellView}/>
            </View>
        );
    };

    render() {
        console.log(this.state.dataSource, "*******************************");
        console.log("ekjfhkwrghj");
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    {/* <Header /> */}
                    <SafeAreaView style={{backgroundColor: "orange"}}>
                        <View style={[styles.viewStyle1, {flexDirection: "row"}]}>
                            <View style={styles.viewDetails1}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate("AdminFunction");
                                    }}
                                >
                                    <View
                                        style={{
                                            height: hp("4%"),
                                            width: wp("15%"),
                                            alignItems: "center",
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
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Image
                                    style={[styles.image1]}
                                    source={require("../icons/OyeSpace.png")}
                                />
                            </View>
                            <View style={{flex: 0.2}}>
                                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                            </View>
                        </View>
                        <View style={{borderWidth: 1, borderColor: "orange"}}/>
                    </SafeAreaView>
                    <Text style={styles.titleOfScreen}> My Visitors </Text>

                    <View style={styles.progress}>
                        <ActivityIndicator size="large" color="#01CBC6"/>

                    </View>
                </View>
            );
        }
        return (
            <View style={styles.mainView}>
                {/* <Header /> */}
                <SafeAreaView style={{backgroundColor: "orange"}}>
                    <View style={[styles.viewStyle1, {flexDirection: "row"}]}>
                        <View style={styles.viewDetails1}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("AdminFunction");
                                }}
                            >
                                <View
                                    style={{
                                        height: hp("4%"),
                                        width: wp("15%"),
                                        alignItems: 'flex-start',
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
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Image
                                style={[styles.image1]}
                                source={require("../icons/OyeSpace.png")}
                            />
                        </View>
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: "orange"}}/>
                </SafeAreaView>

                <Text style={styles.titleOfScreen}>View All Visitors</Text>
                <TextInput style={styles.textinput} placeholder="search by name...." round
                           onChangeText={this.searchFilterFunction}
                />
                <View style={{borderColor: '#cecece', borderWidth: 0.5, marginTop: hp("2%")}}></View>
                <View style={styles.datePickerButtonView}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: "center",
                        }}
                    >

                        <Text style={{color: '#38bcdb', fontSize: hp("1.5%")}}>From</Text>

                        <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                            <View style={styles.datePickerBox}>
                                <Text style={styles.datePickerText}>{this.state.dobText} </Text>
                                <DatePickerDialog
                                    ref="dobDialog"
                                    onDatePicked={this.onDOBDatePicked.bind(this)}
                                />
                                <Image
                                    style={styles.viewDatePickerImageStyle}
                                    source={require("../icons/calender.png")}
                                />
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            paddingLeft: 15
                        }}
                    >

                        <Text style={{color: '#38bcdb', fontSize: hp("1.5%")}}>To</Text>

                        <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                            <View style={styles.datePickerBox}>
                                <Text style={styles.datePickerText}>{this.state.dobText1} </Text>
                                <DatePickerDialog
                                    ref="dobDialog1"
                                    onDatePicked={this.onDOBDatePicked1.bind(this)}
                                />
                                <Image
                                    style={styles.viewDatePickerImageStyle}
                                    source={require("../icons/calender.png")}
                                />
                            </View>

                        </TouchableOpacity>

                    </View>
                    <View
                        style={{

                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Button bordered warning style={[styles.buttonUpdateStyle, {justifyContent: "center"}]}
                                onPress={() => this.myVisitorsGetList()}
                        >
                            <Text style={{color: "white"}}>Get</Text>
                        </Button>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#f4f4f4',
                    height: hp("6%"),
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginTop: 15
                }}>
                    <View style={{justifyContent: 'space-around', alignItems: 'center'}}>
                        <Text style={{fontSize: hp('2.2%'), color: '#474749',}}>Visitors Count: <Text
                            style={{color: 'black', fontWeight: 'bold'}}>{this.state.totalVisitors}</Text></Text>
                    </View>
                    <View style={{justifyContent: 'space-around', alignItems: 'center'}}>
                        <Text style={{fontSize: hp('2.2%'), color: '#474749',}}>Entries: <Text
                            style={{color: 'black', fontWeight: 'bold'}}>{this.state.dataSource.length}</Text></Text>
                    </View>
                </View>


                {this.state.dataSource.length == 0 ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                        <Text style={{
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: hp('2%')
                        }}>No entries for selected date</Text>
                        {/* <Text style={{ backgroundColor: 'white',alignItems: 'center', justifyContent: 'center',fontSize:hp('2%') }}>Choose other date please.</Text> */}
                    </View>
                    :
                    <FlatList
                        style={{marginTop: 15}}
                        data={this.state.dataSource}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => item.name}
                    />}
            </View>
        );

    }
}

const styles = StyleSheet.create({
    image1: {
        width: wp("17%"),
        height: hp("12%"),
        marginRight: hp("3%")
    },
    viewDetails1: {
        flex: 0.3,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 3
    },
    viewDetails2: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: hp("3%"),
        height: hp("3%"),
        marginTop: 5
        // marginLeft: 10
    },
    viewStyle1: {
        backgroundColor: "#fff",
        height: hp("7%"),
        width: Dimensions.get("screen").width,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: "relative"
    },
    datePickerButtonView: {
        marginTop: hp("1%"),
        flexDirection: "row",
        //justifyContent: "flex-end",
        justifyContent: "space-around",
        marginHorizontal: hp('2%')
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column"
    },
    progress: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    mainView: {
        flex: 1,
    },
    titleOfScreen: {
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: hp("2.5%"),
        marginTop: hp("2%"),
        marginBottom: hp("2%"),
        color: '#ff8c00' //orange hex
    },
    tableView: {
        flexDirection: "column",
    },
    lineForCellView: {
        backgroundColor: "lightgray",
        height: hp('0.1%')
    },
    cellView: {
        flexDirection: "row",
        paddingRight: hp('0%'),
        paddingLeft: 5,
        marginBottom: 6,
        justifyContent: "space-between"
    },
    containerImageView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
        //margin: 5
    },
    mainCardItemImage: {
        height: hp("8%"),
        width: hp("8%"),
        borderRadius: hp("4%"),
        borderColor: "orange",
        borderWidth: 2
    },
    textViewContainer: {
        flex: 3,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    viewTextStyle: {
        flexDirection: "row",
        alignItems: "center"
    },
    viewImageStyle: {
        flexDirection: "row",
        width: 15,
        height: 15
    },
    viewDatePickerImageStyle: {
        width: wp("3%"),
        height: hp("2.2%"),
        marginRight: hp("0.5%")
    },
    cellEndIcons: {
        flex: 0.5,
        alignItems: "flex-end",
        justifyContent: "center",
        flexDirection: "column",
        paddingRight: 0
    },
    smallCardItemImage: {
        height: (15),
        width: 15
    },
    nameTextStyle: {
        padding: 5,
        fontSize: 16,
        fontWeight: 'bold'
    },
    subNameTextStyleOne: {
        padding: 5,
        fontSize: 13
    },
    subNameTextStyleTwo: {
        padding: 5,
        fontSize: 13
    },
    textinput: {
        height: hp("5.7%"),
        borderWidth: hp("0.1%"),
        borderRadius: hp("3%"),
        borderColor: "#cecece",
        marginHorizontal: hp("2%"),
        paddingLeft: hp("2%"),
        fontSize: hp("1.8%")
    },
    datePickerBox: {
        margin: hp("1.0%"),
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: hp('0.2%'),
        height: hp("4%"),
        borderColor: '#bfbfbf',
        padding: 0
    },
    datePickerText: {
        fontSize: hp("1.5%"),
        marginLeft: 5,
        marginRight: 5,
        color: "#474749"
    },
    buttonUpdateStyle: {
        width: wp('16%'),
        borderRadius: hp("3%"),
        borderWidth: wp("2%"),
        height: hp("5%"),
        marginRight: hp("1%"),
        backgroundColor: "orange",
        borderColor: "orange"
    }
});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        associationid: state.DashboardReducer.associationid,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID,
        userReducer: state.UserReducer,

    }
};

export default connect(mapStateToProps)(ViewAllVisitorsList);