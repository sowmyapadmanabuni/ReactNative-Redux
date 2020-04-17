/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


import React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View,SafeAreaView,Dimensions,  BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import base from "../../base";
import EmptyView from "../common/EmptyView";
import {connect} from 'react-redux';
import Share from 'react-native-share';
import {updateSelectedCheckPoints} from '../../actions';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    widthPercentageToDP
} from 'react-native-responsive-screen';


class PatrollingCommonHeader extends React.Component {
    static propTypes = {
        isHidden: PropTypes.bool,
        isReportVisible: PropTypes.bool,
        isShareVisible: PropTypes.bool
    };
    static defaultProps = {
        isHidden: false,
        isReportVisible: true,
        isShareVisible: false
    };

    constructor(props) {
        super(props);
    }

    navigateBack() {
        let isHidden = this.props.isHidden;
        let isReportVisible = this.props.isReportVisible;
        let isShareVisible = this.props.isShareVisible;
        const {goBack} = this.props.navigation;

        if (!isHidden && !isReportVisible && this.props.isReshuffling) {
            this.resetPatrolReducer()
        } else {
            goBack(null)
        }
    }

    resetPatrolReducer() {
        const {goBack} = this.props.navigation;
        const {updateSelectedCheckPoints} = this.props;
        updateSelectedCheckPoints({value: null});
        goBack(null);
    }

    render() {

        let isHidden = this.props.isHidden;
        let isReportVisible = this.props.isReportVisible;
        console.log("reports_hidden?",isHidden+" - "+isReportVisible)
        let isShareVisible = this.props.isShareVisible;
        const {goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
              <SafeAreaView style={{ backgroundColor: '#B51414' }}>
                <View style={[styles.viewStyle, { flexDirection: 'row' }]}>
                  <View style={styles.viewDetails1}>
                    <TouchableOpacity
                      onPress={() => this.navigateBack()}
                    >
                      <View
                        style={{
                          height: hp('4%'),
                          width: wp('15%'),
                          alignItems: 'flex-start',
                          justifyContent: 'center'
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          source={require('../../../icons/back.png')}
                          style={styles.viewDetails2}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Image
                      // style={[styles.image1]}
                      source={require('../../../icons/OyespaceSafe.png')}
                    />
                  </View>
                  <View style={{ flex: 0.2, alignItems:'center',justifyContent:'center',}}>
                  {!isHidden ?
                    !isReportVisible ?
                        <TouchableOpacity onPress={() => this.openScheduling()}
                                          style={styles.scheduleReport}>
                            <Text style={styles.scheduleTextStyle}>Next</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={() => this.handleIconPress(isShareVisible)}>
                            <Image
                            resizeMode={Platform.OS === 'ios'?'contain':'center'}
                            style={{height: '70%', width: widthPercentageToDP('40%'),alignSelf:'center',marginTop:'5%'}}
                            source={isShareVisible ? require('../../../icons/share.png') : require('../../../icons/documents.png')}/>
                        </TouchableOpacity>
                    : <EmptyView width={"20%"}/>}
                    </View>
                </View>
              </SafeAreaView>
    
              </View>
          );
    }

    handleIconPress(isShareVisible) {
        if (isShareVisible) {
            console.log(">>>>>" ,this.props.selectedCheckPoints)
            console.log("Base 64:", this.props.dashboardReducer);
            let base64Image = this.props.selectedCheckPoints.qrBase64.value;
            let shareImageBase64 = {
                title: "Check Point QR",
                message: "Association Name: " + this.props.dashboardReducer.selectedDropdown,
                url: 'data:image/png;base64,' + base64Image
            };
            console.log("base 64:", shareImageBase64);
            Share.open(shareImageBase64).then((response) => {
                console.log(response)
            });
        } else {
            this.props.navigation.navigate('patrollingReport')
        }
    }

    openScheduling() {
        console.log("Props in patrolling Header:",this.props)
        if(this.props.isReshuffling){
            if (this.props.selectedCheckPoints.selectedCheckPoints === null || this.props.selectedCheckPoints.selectedCheckPoints.length === 0) {
                alert("Please select Checkpoint before scheduling the patrolling");
            } else {

                this.schedulePatrolling();
            }
        }
        else{
            this.validateCheckPoint()
          //  this.props.navigation.navigate("schPatrolling");
        }
    }


    validateCheckPoint(){
        let cpList = this.props.selectedCheckPoints.selectedCheckPoints;
        let cpLength = cpList.length;
        console.log("CPLIST,CPLENGTH:",cpList,cpLength)
        if(cpList[0].cpcPntAt !== "StartPoint"){
            alert("The first checkpoint should be a start point")
        }
        else if(cpList[cpLength-1].cpcPntAt !== "EndPoint"){
            alert("The last checkpoint should be an end point")
        }
        else{
            this.props.navigation.navigate("schPatrolling")
        }


    }

    schedulePatrolling() {
        let cpList = this.props.selectedCheckPoints.selectedCheckPoints;
        let spCount = 0;
        let epCount = 0;
        let cpCount = 0;
        let isCP = false;
        let cpArray = [];
        for (let i in cpList) {
            if (cpList[i].cpcPntAt === 'StartPoint') {
                spCount += 1;
            }
            if (cpList[i].cpcPntAt === 'EndPoint') {
                epCount += 1;
            }
            if (cpList[i].cpcPntAt === 'CheckPoint') {
                isCP = true;
                cpCount += 1;
                cpArray.push(cpList[i])
            }
        }
        if (spCount === 1 && epCount === 1 && isCP && cpCount >= 2) {
            this.props.navigation.navigate("reshufflePatrol")

        } else if (spCount > 1) {
            alert("Please select only one Start Point")
        } else if (epCount > 1) {
            alert("Please select only one End Point")
        } else if (!isCP && (spCount === 0 || spCount === 1) && (epCount === 0 || epCount === 1)) {
            alert("Please select at least two check Points")
        } else if (spCount === 0) {
            alert("Please select at least one Start Point")
        } else if (epCount === 0) {
            alert("Please select at least one end Point")

        } else if (cpCount < 2) {
            alert("Please select at least two check Points")
        } else {
            alert("Please select the check points before scheduling patrol");
        }

    }

}

const styles = StyleSheet.create({
    // container: {
    //     height: "10%",
    //     width: "100%",
    //     backgroundColor: "white",
    //     borderBottomWidth: 1,
    //     borderColor: "orange",
    //     flexDirection: 'row',
    //     flex: Platform.OS === 'ios' ? 1 : 0  ,
    //     alignItems: 'center',
    //     //justifyContent: 'center',
    //     paddingLeft: 10,
    //        // backgroundColor: '#fff'

    // },
    // buttonView: {
    //     width: "17%",
    //     justifyContent: 'center',
    //     height: "90%",
    //     paddingTop: 3
    // },
    // backButton: {
    //     height: '45%'
    // },
    // logoView: {
    //     height: 50,
    //     width: widthPercentageToDP('60%'),
    //     backgroundColor: base.theme.colors.white,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     marginRight:Platform.OS==='ios'?14:20
    // },
    // logo: {
    //     height: 30,
    //     width: 100,
    //     alignSelf: 'center'
    // },
    // scheduleReport: {
    //     borderWidth: 1,
    //     height: "40%",
    //     width: widthPercentageToDP("15%"),
    //     borderRadius: 10,
    //    // marginRight: widthPercentageToDP('35%'),
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     marginRight:8,
    //     borderColor: 'orange'
    // },
    // scheduleTextStyle: {
    //     color: 'orange',
    //     textAlign: 'center',
    //     width: widthPercentageToDP('20%'),
    //     fontFamily: base.theme.fonts.medium
    // },
    image1: {
        width: wp('34%'),
        height: hp('18%'),
        marginRight: hp('3%')
      },
    //reportImage: {height: "45%", width: widthPercentageToDP("20%")},
    container: {
        // flex: 1,
        backgroundColor: '#fff'
      },
      buttonView: {
        width: '17%',
        justifyContent: 'center',
        height: '90%',
        paddingTop: 3,
        alignItems: 'center'
      },
      backButton: {
        height: '30%',
        width: '30%'
      },
      logoView: {
        height: 40,
        width: widthPercentageToDP('60%'),
        backgroundColor: base.theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
      },
      logo: {
        height: 50,
        width: 100,
        alignSelf: 'center'
      },
      scheduleReport: {
        borderWidth: 1,
        height: '40%',
        width: widthPercentageToDP('15%'),
        borderRadius: 10,
        //marginRight: widthPercentageToDP('35%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#B51414',
        right:Platform.OS=="ios" ?0:10
      },
      scheduleTextStyle: {
        color: '#B51414',
        textAlign: 'center',
        width: widthPercentageToDP('20%'),
        fontFamily: base.theme.fonts.medium
      },
      reportImage: { height: '50%', width: widthPercentageToDP('20%') },
    
      viewStyle: {
        backgroundColor: '#fff',
        height: hp('7%'),
        width: Dimensions.get('screen').width,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
      },
      image1: {
        width: wp('34%'),
        height: hp('18%'),
        marginRight: hp('3%')
      },
    
      viewDetails1: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
      },
      viewDetails2: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        // width: hp('3%'),
        // height: hp('3%'),
        marginTop: 5
        // marginLeft: 10
      },
    
      titleOfScreen: {
        marginTop: hp('1.6%'),
        textAlign: 'center',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#ff8c00',
        marginBottom: hp('1.6%')
      }
});


const mapStateToProps = state => {
    return {
        selectedCheckPoints: state.PatrollingReducer,
        dashboardReducer: state.DashboardReducer,
       
    }
};

export default connect(mapStateToProps, {updateSelectedCheckPoints})(PatrollingCommonHeader);

