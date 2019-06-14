import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet,Image,FlatList,ScrollView,Alert } from 'react-native'
import { TextField } from 'react-native-material-textfield';
import { Fonts } from '../pages/src/utils/Fonts';
import { Dropdown } from 'react-native-material-dropdown';
import {connect} from 'react-redux';

class List extends Component {
    constructor() {

        super()
    
        this.state = {
            dataSource:[],
            UnitList:[],
          Blockname: '',
          Blocktype: '',
        Noofunits: '',
        MngName:'',
        MngMobile:'',
        MngEmail:'',
          connection_Status: "",
          totalnoofunits:0,
          totalnoofblocks:0,
          dataSourcelength:0,
          totalnoofunitscreated:0,
        }
        console.log('EditProfile ', 'constructor');
    
      }
      BlockName = (blockname) => {
        this.setState({ Blockname: blockname });
     
    
      }
    BlockType = (blocktype) => {
        this.setState({ Blocktype: blocktype });
        
    
      }
      NoofUnits = (noofunits) => {
        this.setState({ Noofunits: noofunits });
        
      }
      renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;

        return (
            <View style={{flex:1,backgroundColor:'white'}}>
            <View style={styles.rectangle1}>

                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 5 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{fontSize:15,color:'black',}}>Block Name: {item.blBlkName}</Text>
                    {/* <TouchableOpacity
                          style={{ flex: 1, backgroundColor: 'white',alignItems: "flex-end" }}
                          onPress={() => navigate('EditBlockScreen', {BlockName: item.blBlkName, BlockID: item.blBlockID,blocktype:item.blBlkType, NoOfunits:item.blNofUnit.toString() })}>
                          <Image source={require('../pages/assets/images/edit.png')} style={{ height: 20, width: 20 }} />

                        </TouchableOpacity> */}
                        </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{fontSize: 15, color: 'black',flex:6}}> No of Units: {item.blNofUnit}</Text>
                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: 'white',alignItems: "center" }}
                          onPress={() => navigate('EditBlockScreen', {BlockName: item.blBlkName, BlockID: item.blBlockID,blocktype:item.blBlkType, NoOfunits:item.blNofUnit.toString() })}>
                          <Image source={require('../pages/assets/images/edit.png')} style={{ height: 20, width: 20 }} />

                        </TouchableOpacity>
                        <TouchableOpacity
          style={styles.mybutton1}
          onPress={() => navigate('BlockWiseUnitListScreen', { id: item.asAssnID,blockID:item.blBlockID,units:item.blNofUnit })}
        >
          <Text style={{color:'black'}}> Add Units </Text>
        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </View>
        )
    }

    renderSeparator = () => {
        return (
            <View style={{ height: 2, width: '100%', backgroundColor: '#fff', }}>
            </View>
        )
    }
    componentDidMount(){
      this.makeRemoteRequest();
    }
    makeRemoteRequest=() =>{
      this.totalnounits();
       
      const { } = this.props.navigation.state;
      console.log('ff')
      console.log('componentdidmount')
      const url = this.props.champBaseURL+'Block/GetBlockListByAssocID/'+this.props.SelectedAssociationID;

      console.log(url)
      fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },

      })
          .then((response) => response.json())
          .then((responseJson) => {

              this.setState({
                  dataSource: responseJson.data.blocksByAssoc,
                  isLoading: false
              })
              var totalUnitCreated = 0;
              for (var i=0; i<this.state.dataSource.length; i++) {

                totalUnitCreated += this.state.dataSource[i].blNofUnit;
            }
            this.setState({
              totalnoofunitscreated: totalUnitCreated,
              
          }) 


              console.log('123', totalUnitCreated);
              var totalapilength=this.state.dataSource.length;
              this.setState({
                dataSourcelength: totalapilength,
                
            }) 

          })

          .catch((error) => {
              console.log(error)
          })  
    }
    totalnounits = () => {
        const { } = this.props.navigation.state;
        console.log('ff')
        console.log('componentdidmount')
        const url = this.props.champBaseURL+'association/getAssociationList/'+this.props.SelectedAssociationID;

        console.log(url)
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },

        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    UnitList: responseJson.data.association,
                    isLoading: false
                })
                console.log('manu', responseJson);
                var total = responseJson.data.association.asNofUnit;
        var totalBlocks=responseJson.data.association.asNofBlks;
                // for (var i=0; i<this.state.UnitList.length; i++) {
        
                //     total = this.state.UnitList[i].asNofUnit;
        
                // }
                this.setState({

                    totalnoofunits:total,
            
                    })
                    this.setState({

                      totalnoofblocks:totalBlocks,
              
                      })
                    
            
                console.log('total', responseJson.data.association.asNofUnit+this.state.totalnoofblocks)
                //alert('hi',this.state.totalnoofunits)
            })

            .catch((error) => {
                console.log(error)
            })   


    }
    

    submit = () => {

        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
        Bname = this.state.Blockname;
        Btype = this.state.Blocktype;
        Nounits = this.state.Noofunits;
       
    
        if (Bname == '' || Bname == undefined) {
          alert('Block Name should not be Empty');
        } else if (Btype == '' || Btype == undefined) {
          alert('Block Type should not be Empty');
        } else if (Nounits == '') {
          alert('Enter no of units per block ');
        } 
        else if (this.state.dataSourcelength==this.state.totalnoofblocks) {
          alert('You already crossed your limit');
        } 

        else {
    
        
    
          anu = {
    
            "ASAssnID": this.props.SelectedAssociationID,
            "ACAccntID": this.props.MyAccountID,
            "blocks": [
                {
                    "BLBlkName"  : Bname,
                    "BLBlkType"  : Btype, 
                    "BLNofFlrs"  :  1,
                	"BLNofUnit"  :  Nounits
                    
                    
                }
            ]
           
    
          }
          // anu = {
          //   "ASAssnID" :this.props.SelectedAssociationID,
          //   "ACAccntID"     :  this.props.MyAccountID,
          //   "blocks" :[
          //   {
          //   "BLBlkName"     : Bname,
          //   "BLBlkType"     : Btype,
          //   "BLNofUnit"     : Nounits,
          //   "BLMgrName"     : MngName,
          //   "BLMgrMobile"   : MngMobile,
          //   "BLMgrEmail"    : MngEmail,
          //   "ASMtType"      : "",
          //   "ASMtDimBs"     : "",
          //   "ASMtFRate"     : "",
          //   "ASUniMsmt"     : "",
          //   "ASBGnDate"     : "",
          //   "ASLPCType"     : "",
          //   "ASLPChrg"      : "",
          //   "ASLPSDate"     : "",
          //   "ASDPyDate"     : "",
          //   "BankDetails":
          //   [
          //   {
          //     "BABName":"",
          //     "BAActType":"",
          //     "BAActNo":"",
          //     "BAIFSC":"",
          //     "BAActBal":''

          //     }, 
          //     ]

          //     },
          //     ]
          //     }
    
          console.log('anu', anu)
    
          fetch(this.props.champBaseURL + 'Block/create',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
              },
              body: JSON.stringify(anu)
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log('logresponseupdate', responseJson);
              if (responseJson.success) {
                this.makeRemoteRequest();
    
              } else {
                console.log('hiii', failed);
    
                Alert.alert('Failed',
                  'You are not Admin of this Association',
                  [
                    {
                      text: 'Ok', onPress: () => { }
                    },
                  ],
                  {
                    cancelable: false
                  }
                );
              }
            })
            .catch((error) => {
              Alert.alert('Failed',
              'You are not Admin of this Association',
              [
                {
                  text: 'Ok', onPress: () => { }
                },
              ],
              {
                cancelable: false
              }
            );


              console.log(error)
            })
    
        }
      }

   render() {
    const { navigate } = this.props.navigation;
    let { phone } = this.state;
    let Block_Category = [{
      value: 'Residential',
    }, {
      value: 'Commercial',
    }
  ];
    
      return (
         <View style={{height:'100%',width:'100%', backgroundColor:'white'}}>
   <View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45,
}}>
<TouchableOpacity onPress={() => navigate(('AdminFunction'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25,  }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyeSpace_hor.png')}
style={{
height: 38, width: 95, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
<View style={{ flex: 3,alignSelf: 'flex-end',alignItems:'flex-end',justifyContent:'flex-end' }}>
                         

                        </View>


</View>
                    <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center',marginBottom:2,marginLeft:'3%' }}>Block Details</Text>
{/* this.state.dataSourcelength===this.state.totalnoofblocks? 
    alert('You already created '+this.state.totalnoofblocks+' blocks and '+ this.state.totalnoofunits+' units.'):
    alert('You need to create '+this.state.totalnoofblocks+' blocks and '+ this.state.totalnoofunits+' units.') */}
         {this.state.dataSourcelength===this.state.totalnoofblocks? 
          <Text style={{height:0}}></Text>
          :
         <View style={{borderColor:'orange',borderWidth:1,borderRadius:10,marginRight:10,marginLeft:10}}>
         <View style={{flexDirection:'row'}}>
        <Text>No of units:{this.state.totalnoofunits} </Text>
        <Text> Total No of units created:{this.state.totalnoofunitscreated} </Text>


         </View>
        <View style={{   marginLeft: 15,

paddingRight: 15 }}>
            <TextField
              label='Block Name'
              fontSize={12}
              labelHeight={20}
              characterRestriction={20}
              activeLineWidth={0.5}
              keyboardType='default'
              maxLength={20}
              onChangeText={this.BlockName}
            />

          </View>
          <View style={{marginLeft: 15,

paddingRight: 15}}>
      <Dropdown
        label='Block Type'
        data={Block_Category}
        fontSize={12}
        onChangeText={this.BlockType} 
      />
      </View>
          {/* <View style={{  marginLeft: 15,

paddingRight: 15  }}>
            <TextField
              label='Block Type'
              fontSize={12}
              labelHeight={10}
              characterRestriction={30}
              activeLineWidth={0.5}
              keyboardType='sentence'
              maxLength={30}
              onChangeText={this.BlockType}
            />
          </View> */}
          <View style={{   marginLeft: 15,

paddingRight: 15 }}>
          <TextField
              label='No of Units'
              fontSize={12}
              labelHeight={10}
              characterRestriction={3}
              activeLineWidth={0.5}
              keyboardType='number-pad'
              maxLength={3}
              onChangeText={this.NoofUnits}
            />
            </View>
            <TouchableOpacity
          style={styles.mybutton}
          onPress={this.submit.bind(this)}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        </View>}
   
                    <FlatList data={this.state.dataSource}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={() => (!this.state.dataSource.length ?
                            <Text style={{alignSelf:'center',color:'black'}}>The block list is empty</Text>
                            : null)
                          }
                    />
         </View>
      )
   }
}

const mapStateToProps = state => {
  return {
    champBaseURL: state.OyespaceReducer.champBaseURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    MyAccountID: state.UserReducer.MyAccountID,

  };
};

export default connect(mapStateToProps)(List);

const styles = StyleSheet.create ({
   container: {
      padding: 10,
      marginTop: 3,
      backgroundColor: '#d9f9b1',
      alignItems: 'center',
   },
   title: { fontSize: 12, color: 'black', marginBottom: 4, },

   subtext: {
       fontSize: 12, fontFamily: Fonts.OpenSansBold, color: 'black',
       marginBottom: 2,
   },
   rectangle1: {
    flex: 1, backgroundColor: 'white', padding: 5, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, borderRadius: 2, borderWidth: 1,marginRight:10,marginLeft:10
},
   text: {
      color: '#4f603c'
   },
   mybutton: {
    alignSelf:'center', marginTop:5,width:'30%', paddingTop:2, paddingBottom:2,margin:5,
   backgroundColor:'white', borderRadius:5, borderWidth: 1, borderColor: 'orange',
  
  },
  mybutton1: {
    alignSelf:'flex-end',justifyContent:'flex-end' ,alignItems:'flex-end',
   backgroundColor:'white', borderRadius:5, borderWidth: 1, borderColor: 'orange',
  
  },
  submitButtonText: {
    color: 'black',
    margin:'1%',
    textAlign:'center'
  },
})