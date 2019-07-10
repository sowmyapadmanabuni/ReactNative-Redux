import React, {Component} from 'react';
import {
    Image, Text, TouchableOpacity,
    View, FlatList, Platform, PermissionsAndroid, ScrollView, ActivityIndicator

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


class GetStaffReport extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isLoading: false,
            bottomPageIndicator: [1, 2, 3],
            tableHeader: ['Date', 'Entry Point', 'Entry Time', 'Exit Point', 'Exit Time'],
            tableData: [],
            staffReport: [],
            checkPage: 0,
            isPermitted: false,
            filePath: '',
            noDataMsg: false,
            selectedAssociationId: '',
            selectedWorkerId: '',
            startDate: '',
            endDate: '',
        },
            this.getTheReport = this.getTheReport.bind(this);


    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.getTheReport(0, nextProps);

    }

    componentWillMount() {
        this.getTheReport(0, this.props);

        if (Platform.OS === 'android') {
            this.getAndroidPermissions()
        } else {
            this.setState({
                isPermitted: true
            })
        }

    }

    getAndroidPermissions() {
        let that = this;


        async function requestExternalWritePermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'CameraExample App External Storage Write Permission',
                        message:
                            'CameraExample App needs access to Storage data in your SD Card ',
                    }
                );
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
            fileName: 'test',
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
                .done((res) => {
                    console.log("Share done", res)
                })
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


    async getTheReport(pageSelected, props) {
        let self = this;
        self.setState({isLoading: true})

        let input = {
            "ASAssnID": "2",   //props.userReducer.selectedAssociationId
            "WKWorkID": "4",    //props.staffReducer.staffId
            "FromDate": "2019-02-04", //props.staffReducer.startDate
            "ToDate": "2019-02-13" //props.staffReducer.endDate
        }

        let stat = await base.services.OyeSafeApi.getStaffReportByDate(input);

        self.setState({isLoading: false})

        let initialDate = input.FromDate;
        let endDate = input.ToDate;
        let initialDateString = moment(input.FromDate, "YYYY-MM-DDTHH:mm:ss a");
        let endDateString = moment(input.ToDate, "YYYY-MM-DDTHH:mm:ss a")
        let duration = moment.duration(endDateString.diff(initialDateString));
        base.utils.logger.log(duration.days())
        let difference = duration.days()
        try {
            if (stat && stat.data.worker && stat.data.worker.length !== 0) {

                let reportsData = stat.data.worker;
                let tableData = [];
                let setData = [];
                if (difference !== 0) {
                    for (let i = 0; i < reportsData.length; i++) {
                        let rowData = []
                        if (initialDate !== reportsData[i].vlEntryT || !reportsData[i]) {
                            base.utils.logger.logArgs(i, initialDate, reportsData[i].vlEntryT)
                            rowData.push(moment(initialDate, 'YYYY-MM-DD').format('DD-MM-YYYY'))
                            rowData.push('No Entry on this Date')

                        } else {
                            base.utils.logger.logArgs(i, initialDate, reportsData[i].vlEntryT)
                            rowData.push(moment(initialDate, 'YYYY-MM-DD').format('DD-MM-YYYY'))
                            rowData.push(reportsData[i].vlengName)
                            rowData.push(moment(reportsData[i].vlEntryT).format('HH:mm' + ' A'))
                            rowData.push(reportsData[i].vlexgName)
                            rowData.push(moment(reportsData[i].vlExitT).format('HH:mm' + ' A'))
                        }
                        if (initialDate !== endDate) {
                            initialDate = moment(initialDate).add(1, 'day').format('YYYY-MM-DD')
                        }
                        tableData.push(rowData);
                    }
                    self.setState({
                        staffReport: tableData
                    })

                    if (tableData.length <= 10) {
                        if (pageSelected === 0) {
                            setData = tableData
                            self.setState({
                                noDataMsg: false
                            })
                        } else if (pageSelected === 2 || pageSelected === 1) {
                            self.setState({
                                noDataMsg: true
                            })
                        }
                    } else if (tableData.length > 10 && tableData.length <= 20) { //11 to 20
                        if (pageSelected === 1) {
                            for (let i = 11; i < tableData.length; i++) {
                                setData.push(tableData[i])
                            }
                            self.setState({
                                noDataMsg: false
                            })
                        } else if (pageSelected === 2) {
                            self.setState({noDataMsg: true})
                        } else if (pageSelected === 0) {
                            for (let i = 0; i < 10; i++) {
                                setData.push(tableData[i])
                            }
                            self.setState({
                                noDataMsg: false
                            })
                        }
                    } else if (tableData.length > 20) { // more than 20
                        if (pageSelected === 2) {
                            for (let i = 21; i < tableData.length; i++) {
                                setData.push(tableData[i])
                            }
                            self.setState({
                                noDataMsg: false
                            })
                        } else if (pageSelected === 1) {
                            for (let i = 11; i < 20; i++) {
                                setData.push(tableData[i])
                            }
                            self.setState({
                                noDataMsg: false
                            })
                        } else if (pageSelected === 0) {
                            for (let i = 1; i < 10; i++) {
                                setData.push(tableData[i])
                            }
                            self.setState({
                                noDataMsg: false
                            })
                        }
                    }

                } else {
                    let rowData = [];
                    rowData.push(moment(initialDate, 'YYYY-MM-DD').format('DD-MM-YYYY'))
                    rowData.push(reportsData[0].vlengName)
                    rowData.push(moment(reportsData[0].vlEntryT).format('HH:mm' + ' A'))
                    rowData.push(reportsData[0].vlexgName)
                    rowData.push(moment(reportsData[0].vlExitT).format('HH:mm' + ' A'))
                    setData.push(rowData)
                }

                self.setState({
                    tableData: setData
                })

            } else {
                let tableData = 'No report exist'

                self.setState({
                    tableData: tableData
                })

            }
        } catch (error) {
            console.log('Error', error)
        }
    }

    render() {
        base.utils.logger.log(this.props)
        return (
            <View style={StaffReportStyle.mainContainer}>
                <View style={StaffReportStyle.detailsMainView}>
                    <View style={StaffStyle.detailsLeftView}>
                        <Image style={StaffStyle.staffImg}
                               source={{uri: base.utils.validate.handleNullImg(this.props.staffReducer.staffProfilePic)}}
                        />
                        <View style={StaffStyle.textView}>
                            <Text style={StaffStyle.staffText}
                                  numberofLines={1} ellipsizeMode={'tail'}>{this.props.staffReducer.staffName}</Text>
                        </View>
                        <Text style={StaffStyle.desigText}> ({this.props.staffReducer.staffDesignation})</Text>
                    </View>
                    <View style={StaffStyle.detailsRightView}>
                        <TouchableOpacity
                            onPress={() => this.state.isPermitted ? this.createPDF() : alert('Please Provide permissions to share report')}>
                            <Image style={StaffStyle.shareImg}
                                   source={require('../../../../../icons/share.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>


                <ScrollView style={StaffReportStyle.scrollViewTable}>
                    {this.renderViewPagerData()}
                </ScrollView>


                <View style={StaffReportStyle.bottomView}>
                    <TouchableOpacity style={{alignItems: 'center'}}
                                      onPress={() => this.changePage(this.state.checkPage - 1)}>
                        <Image style={StaffReportStyle.arrowIcon}
                               source={require('../../../../../icons/prev.png')}
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
                                      onPress={() => this.changePage(this.state.checkPage + 1)}>
                        <Image style={StaffReportStyle.arrowIcon}
                               source={require('../../../../../icons/next.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    changePage(index) {
        let self = this;
        let val = index
        if (index > 2) {
            val = 0
        } else if (index < 0) {
            val = 2
        }
        self.setState({
            checkPage: val
        })
        this.getTheReport(val)

    }

    arrangeBottomTab(item) {
        return (
            <TouchableOpacity onPress={() => this.changePage(item.index)}
                              style={[StaffReportStyle.bottomTabView, {
                                  shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
                                  shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
                                  backgroundColor: this.state.checkPage === item.index ? base.theme.colors.primary : base.theme.colors.white
                              }]}>
                <Text
                    style={{color: this.state.checkPage === item.index ? base.theme.colors.white : base.theme.colors.black}}>
                    {item.item}
                </Text>
            </TouchableOpacity>
        )

    }

    renderViewPagerData() {
        let state = this.state;
        return (
            <View Style={StaffReportStyle.tableMainView}>
                <Table borderStyle={StaffReportStyle.tableView}>

                    <Row data={state.tableHeader} style={StaffReportStyle.tableHead}
                         textStyle={StaffReportStyle.textHead}/>
                    {!this.state.noDataMsg ?
                        state.tableData.map((rowData, index) => (
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

                        :
                        <Row data={['No Data Exist']} style={{height: '60%',width:'90%'}} textStyle={{textAlign: 'center'}}/>}
                </Table>
            </View>
        );
    }

}

const mapStateToProps = state => {
    return {
        userReducer: state.UserReducer,
        staffReducer: state.StaffReducer
    };
};

export default connect(mapStateToProps)(GetStaffReport);

