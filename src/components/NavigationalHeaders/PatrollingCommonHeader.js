/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


import React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import base from "../../base";
import EmptyView from "../common/EmptyView";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {connect} from 'react-redux';
import Share from 'react-native-share';
import {updateSelectedCheckPoints} from '../../actions';


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
        let isShareVisible = this.props.isShareVisible;
        const {goBack} = this.props.navigation;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => this.navigateBack()}
                    // onPress={() => goBack(null)}   //Passing null for as a parameter in the case of nested StackNavigators   --Sarthak Mishra(Synclovis Systems Pvt. Ltd.)
                    style={styles.buttonView}>
                    <Image
                        resizeMode={'center'}
                        style={styles.backButton}
                        source={require('../../../icons/arrowBack.png')}
                    />
                </TouchableOpacity>
                <View style={styles.logoView}>
                    <Image
                        resizeMode={'cover'}
                        style={styles.logo}
                        source={require('../../../icons/oyesafe.png')}
                    />
                </View>
                {!isHidden ?
                    !isReportVisible ?
                        <TouchableOpacity onPress={() => this.openScheduling()}
                                          style={styles.scheduleReport}>
                            <Text style={styles.scheduleTextStyle}>Next</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={() => this.handleIconPress(isShareVisible)}><Image
                            resizeMode={'contain'}
                            style={styles.reportImage}
                            source={isShareVisible ? require('../../../icons/share.png') : require('../../../icons/report.png')}/>
                        </TouchableOpacity>
                    : <EmptyView width={"20%"}/>}
            </View>
        )
    }

    handleIconPress(isShareVisible) {
        if (isShareVisible) {
            console.log("Base 64:", this.props);
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
    container: {
        height: "8%",
        width: "100%",
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: "orange",
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'center',
        paddingLeft: 10,
        marginTop: Platform.OS === 'ios' ? 20 : 0
    },
    buttonView: {
        width: "17%",
        justifyContent: 'center',
        height: "90%",
        paddingTop: 3
    },
    backButton: {
        height: '50%'
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
        height: "40%",
        width: widthPercentageToDP("15%"),
        borderRadius: 10,
        marginRight: widthPercentageToDP('35%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'orange'
    },
    scheduleTextStyle: {
        color: 'orange',
        textAlign: 'center',
        width: widthPercentageToDP('20%'),
        fontFamily: base.theme.fonts.medium
    },
    reportImage: {height: "50%", width: widthPercentageToDP("20%")}
});


const mapStateToProps = state => {
    return {
        selectedCheckPoints: state.PatrollingReducer,
        dashboardReducer: state.DashboardReducer
    }
};

export default connect(mapStateToProps, {updateSelectedCheckPoints})(PatrollingCommonHeader);

