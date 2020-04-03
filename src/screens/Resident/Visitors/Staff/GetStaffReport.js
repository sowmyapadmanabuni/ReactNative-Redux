import React from 'react';
import {
    ActivityIndicator,
    BackHandler,
    FlatList,
    Image,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import base from "../../../../base";
import StaffStyle from "./StaffStyle";
import StaffReportStyle from "./StaffReportStyle"
import {connect} from "react-redux";
import {Cell, Table, TableWrapper} from "react-native-table-component";
import {Row} from '../../../../base/services/rows'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from "react-native-share";
import RNFetchBlob from 'rn-fetch-blob'
import moment from "moment";

let RNFS = require('react-native-fs');

let inActiveLeftIcon = require('../../../../../icons/prev.png');
let activeLeftIcon = require('../../../../../icons/prev1.png');
let inActiveRightIcon = require('../../../../../icons/next1.png');
let activeRightIcon = require('../../../../../icons/next.png');


class GetStaffReport extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isLoading: true,
            bottomPageIndicator: [],
            tableHeader: [['Date', true], ['Entry Point', false],
                ['Entry Time', false],
                ['Exit Point', false],
                ['Exit Time', false]],
            tableData: [],
            staffReport: [],
            isPermitted: false,
            filePath: '',
            selectedAssociationId: '',
            selectedWorkerId: '',
            startDate: '',
            endDate: '',
            isShowViewPager: false,
            numberOfPages: 0,
            pageLimit: 10,
            pageNumber: 1
        };
        this.getTheReport = this.getTheReport.bind(this);


    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.getTheReport(0, nextProps);

    }

    componentWillMount() {
        base.utils.validate.checkSubscription(this.props.assId)
        this.getTheReport(0, this.props);

        if (Platform.OS === 'android') {
            this.getAndroidPermissions()
        } else {
            this.setState({
                isPermitted: true
            })
        }

    }

    componentWillUnmount() {
        //this.backHandler.remove();
    }

    componentDidMount() {
        
        // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        //     console.log("Staff Report");
        //     this.props.navigation.goBack(null);
        //     return true;
        // });
    }

    getAndroidPermissions() {
        let that = this;

        async function requestExternalWritePermission() {
            try {
                /*const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'OyeSafe App External Storage Write Permission',
                        message:
                            'OyeSafe App needs access to Storage data in your SD Card ',
                    }
                );*/
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //If WRITE_EXTERNAL_STORAGE Permission is granted
                    //changing the state to show Create PDF option
                    that.setState({isPermitted: true});
                } else {
                    alert('WRITE_EXTERNAL_STORAGE permission denied');
                }
            } catch (err) {
                alert('Write permission err', err);
                console.warn(err);
            }
        }

        //Calling the External Write permission function
        requestExternalWritePermission();
    }


    async createPDF() {

        let docFolder = Platform.OS === 'android' ? 'documents' : 'docs';
        let htmlContent = base.utils.validate.ReportData(this.state.staffReport);
        let options = {
            html: htmlContent,
            fileName: 'Report',
            directory: docFolder,
        };
        let file = await RNHTMLtoPDF.convert(options);
        if (Platform.OS === 'android' && this.state.isPermitted) {
            const folder = RNFetchBlob.fs.dirs.DownloadDir + "/OyeSpace";
            await RNFS.mkdir(folder);
            const fileName = "Report" + ".pdf"; //We can change the name of the report here

            await RNFS.copyFile(file.filePath, RNFetchBlob.fs.dirs.DownloadDir + "/OyeSpace/" + fileName);

            let shareOptions = {
                type: 'application/pdf',
                url: "file://" + RNFetchBlob.fs.dirs.DownloadDir + "/OyeSpace/" + fileName
            };

            await Share.open(shareOptions).then((res) => {
                console.log("Share options", res)
            })
            .catch(err => console.log("SHARE ERROR::", err));
            await RNFS.unlink(file.filePath);

        } else {

            let shareOptions = {
                type: 'application/pdf',
                url: file.filePath
            };
            await Share.open(shareOptions).then((res) => {
                console.log("SHARE FILE ", res)
            })
                .catch(err => console.log("SHARE ERROR::", err));
        }
    }


    async getTheReport(props) {
        let self = this;
        console.log('Get Date', this.props.staffReducer, this.props.userReducer);
        let input = {
            "ASAssnID": this.props.assId,
            "WKWorkID": this.props.staffReducer.staffId.toString(),
            "FromDate": this.props.staffReducer.startDate,
            "ToDate": this.props.staffReducer.endDate,
            "ACAccntID": this.props.userReducer.MyAccountID,
            "UNUnitID": this.props.dashBoardReducer.uniID
        };
        console.log('Staff Data', input);

        let stat = await base.services.OyeSafeApi.getStaffReportByDate(input);

        self.setState({isLoading: false});

        console.log("GetStaffData", stat,input);


        let initialDate = input.FromDate;
        let endDate = input.ToDate;
        let initialDateString = moment(input.FromDate, "YYYY-MM-DDTHH:mm:ss a");
        let endDateString = moment(input.ToDate, "YYYY-MM-DDTHH:mm:ss a");
        let duration = moment.duration(endDateString.diff(initialDateString));
        base.utils.logger.log(duration.days());
        let difference = duration.as('days');
        let selectedDate = input.FromDate;
        // console.log('hghgfghfgf',difference,difference+1)

        try {
            if (stat && stat.data.worker && stat.data.worker.length !== 0) {
                console.log('Get the data>>>>>>',stat.data.worker)

                let reportsData = stat.data.worker;
                let tableData = [];
                // console.log("Diffrence:",initialDate,reportsData);
                for (let i = 0; i < reportsData.length; i++) {
                    let rowData = [];
                    rowData.push(moment(reportsData[i].vldUpdated, 'YYYY-MM-DD').format('MM-DD-YYYY'));
                    rowData.push(reportsData[i].vlengName);
                    rowData.push(moment(reportsData[i].vlEntryT).format('hh:mm' + ' A'));
                    rowData.push(reportsData[i].vlexgName);
                    rowData.push(reportsData[i].vlexgName === '' ? '' : moment(reportsData[i].vlExitT).format('hh:mm' + ' A'));

                    if (initialDate !== endDate) {
                        initialDate = moment(initialDate).add(1, 'day').format('YYYY-MM-DD')
                    }
                    tableData.push(rowData);
                }
                console.log('Table Data', tableData);
                let datesArr = [];
                for (let i = 0; i < difference + 1; i++) {
                    let tempArr = [];
                    tempArr.push(moment(selectedDate, 'YYYY-MM-DD').format('MM-DD-YYYY'));
                    tempArr.push('No Entry on this Date');
                    datesArr.push(tempArr);

                    if (selectedDate !== endDate) {
                        selectedDate = moment(selectedDate).add(1, 'day').format('YYYY-MM-DD')
                    }

                }
                console.log('Dates Arr', datesArr);

                for (let i = 0; i < datesArr.length; i++) {
                    let dataMatched = false;
                    for (let j = 0; j < tableData.length; j++) {
                        if (datesArr[i][0] == tableData[j][0]) {
                            dataMatched = true;
                        }
                    }
                    if (!dataMatched) {
                        tableData.push(datesArr[i]);
                        console.log("data not matched with", datesArr[i]);
                    }
                }
                tableData.sort(function (a, b) {
                    console.log('@@@@@@@@@', a[0], b[0], moment(a[0]).format(), new Date(moment(a[0]).format()), new Date(a[0]), new Date(b[0]));
                    return new Date(moment(a[0]).format()) - new Date(moment(b[0]).format());
                });
                console.log('Final Data', tableData);


                let numberOfPages = tableData.length / self.state.pageLimit;
                let dataBottomList = [];
                if (numberOfPages !== parseInt(numberOfPages)) {
                    numberOfPages = parseInt(numberOfPages) + 1
                }

                for (let i = 0; i < numberOfPages; i++) {
                    dataBottomList[i] = i + 1
                }
                self.setState({
                    tableData: tableData,
                    staffReport: tableData,
                    numberOfPages: numberOfPages,
                    bottomPageIndicator: dataBottomList
                });

                this.changeTheData(self.state.pageNumber)

            } else {

                self.setState({
                    tableData: []
                })

            }
        } catch (error) {
            base.utils.logger.log(error)
        }
    }


    render() {
        base.utils.logger.log(this.props);
        return (
            !this.state.isLoading ?
                <View style={StaffReportStyle.mainContainer}>
                    <View style={StaffReportStyle.detailsMainView}>
                        <View style={StaffStyle.detailsLeftView}>
                            {this.props.staffReducer.staffProfilePic === '' ?
                                <Image style={StaffStyle.staffImg}
                                       source={{uri: "https://mediaupload.oyespace.com/" + base.utils.strings.noImageCapturedPlaceholder}}
                                />
                                :
                                <Image style={StaffStyle.staffImg}
                                       source={{uri: 'data:image/png;base64,'+ + this.props.staffReducer.staffProfilePic}}
                                />
                            }
                            <View style={StaffStyle.textView}>
                                <Text style={StaffStyle.staffText}
                                      numberofLines={1}
                                      ellipsizeMode={'tail'}>{this.props.staffReducer.staffName}</Text>
                            </View>
                            {this.props.staffReducer.staffDesignation !=="" ?

                                <Text style={StaffStyle.desigText}> ({this.props.staffReducer.staffDesignation})</Text>
                                : <View/>}
                        </View>
                        <View style={StaffStyle.detailsRightView}>
                            {this.state.tableData.length !== 0 ?
                                <TouchableOpacity
                                    onPress={() => this.state.isPermitted ? this.createPDF() : alert('Please Provide permissions to share report')}>
                                    <Image style={StaffStyle.shareImg}
                                           source={require('../../../../../icons/share.png')}
                                    />
                                </TouchableOpacity>
                                :
                                <View/>}
                        </View>
                    </View>


                    <ScrollView style={StaffReportStyle.scrollViewTable}>
                        {this.renderViewPagerData()}
                    </ScrollView>

                    {this.state.numberOfPages > 1 ?
                        <View style={StaffReportStyle.bottomView}>
                            <TouchableOpacity style={{alignItems: 'center'}}
                                              onPress={() => this.changeTheData(this.state.pageNumber - 1)}
                                              disabled={this.state.pageNumber === 1}>
                                <Image style={StaffReportStyle.arrowIcon}
                                       source={this.state.pageNumber === 1 ? inActiveLeftIcon : activeLeftIcon}
                                />
                            </TouchableOpacity>
                            <View style={StaffReportStyle.viewPagerIcons}>
                                <FlatList
                                    data={this.state.bottomPageIndicator}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(item) => this.arrangeBottomTab(item)}
                                    extraData={this.state}
                                    horizontal={true}
                                />
                            </View>
                            <TouchableOpacity style={{alignItems: 'center'}}
                                              onPress={() => this.changeTheData(this.state.pageNumber + 1)}
                                              disabled={this.state.pageNumber === this.state.numberOfPages}>
                                <Image style={StaffReportStyle.arrowIcon}
                                       source={this.state.pageNumber === this.state.numberOfPages ? inActiveRightIcon : activeRightIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <View/>}
                </View> :
                <View style={StaffStyle.activityIndicator}>
                    <ActivityIndicator size="large" color={base.theme.colors.primary}/>
                </View>
        )
    }


    arrangeBottomTab(item) {
        return (
            <TouchableOpacity onPress={() => this.changeTheData(item.index + 1)}
                              style={[StaffReportStyle.bottomTabView, {
                                  shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
                                  shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
                                  backgroundColor: this.state.pageNumber - 1 === item.index ? base.theme.colors.primary : base.theme.colors.white
                              }]}>
                <Text
                    style={{color: this.state.pageNumber - 1 === item.index ? base.theme.colors.white : base.theme.colors.black}}>
                    {item.index + 1}
                </Text>
            </TouchableOpacity>
        )

    }

    renderViewPagerData() {
        let state = this.state;

        return (
            <View Style={StaffReportStyle.tableMainView}>
                {state.tableData.length !== 0 ?
                    <Table borderStyle={StaffReportStyle.tableView}>
                        <Row data={state.tableHeader} style={StaffReportStyle.tableHead}
                             textStyle={StaffReportStyle.textHead}
                             onClickIcon={() => this.onCellClick(this.state.pageNumber)}/>
                        {state.tableData.map((rowData, index) => (
                            <TableWrapper key={index} style={{height: 40, flexDirection: 'row',}}>
                                {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell key={cellIndex} style={{
                                            width: rowData.length < 3 && cellIndex === 1 ? '80%' : '20%',
                                            borderWidth: 1,
                                            backgroundColor: rowData.length < 3 && cellIndex === 1 ? 'red' : base.theme.colors.white
                                        }} data={cellData}
                                              textStyle={[StaffReportStyle.cellData, {color: rowData.length < 3 && cellIndex === 1 ? base.theme.colors.white : base.theme.colors.black}]}>
                                        </Cell>

                                    ))
                                }
                            </TableWrapper>
                        ))
                        }
                    </Table>
                    :
                    <View style={{alignItems: 'center'}}>
                        <Text>No report exist for the selected worker</Text>
                    </View>}
            </View>
        );
    }


    changeTheData(pageNumber, datToReversOrder) {
        let self = this;
        let tableData = [];
        let staffReportData = self.state.staffReport;
        if (datToReversOrder) {
            staffReportData = datToReversOrder
        }
        let pageStartData = ((pageNumber - 1) * (self.state.pageLimit)) + 1;
        let pageEndData = pageNumber * (self.state.pageLimit);
        if (pageEndData > staffReportData.length) {
            pageEndData = staffReportData.length
        }
        let j = 0;
        for (let i = pageStartData - 1; i < pageEndData; i++) {
            tableData[j] = staffReportData[i];
            j = j + 1
        }
        self.setState({tableData: tableData, pageNumber: pageNumber})
    }


    onCellClick(pageNumber) {
        let self = this;
        let data = self.state.staffReport;
        let reverseData = [];
        let j = data.length - 1;
        for (let i = 0; i < data.length; i++) {
            reverseData[i] = data[j];
            j = j - 1;
        }
        self.setState({staffReport: reverseData});
        self.changeTheData(pageNumber, reverseData)
    }


}

const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,
        staffReducer: state.StaffReducer,
        oyeURL: state.OyespaceReducer.oyeURL,
        dashBoardReducer: state.DashboardReducer,
        assId:state.DashboardReducer.assId ,
        uniID: state.DashboardReducer.uniID,
    };
};

export default connect(mapStateToProps)(GetStaffReport);
