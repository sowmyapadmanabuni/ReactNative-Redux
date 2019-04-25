/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import ImagePicker from 'react-native-image-picker';
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button} from 'react-native';

export default class App extends Component {

    onClickButton(){
    const options = {
        title: 'Select image',
        // customButtons: [{ name: 'doc', title: 'Document' },{ name: 'loc', title: 'Location' },{ name: 'con', title: 'Contact' }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, (response) => {
        if (!response.didCancel && !response.error) {
            if (response.uri) {
                 var data = new FormData();
                 data.append('Test', { uri: response.uri, name: 'selfie.jpg', type: 'image/jpg' });
                 const config = {
                     method: 'POST',
                     headers: {"X-Champ-APIKey":"1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1","content-type": "multipart/form-data"},
                     body: data };
                     console.log("Config",config);
                      fetch('http://cohapi.careofhomes.com/champ/api/v1/association/upload', config).then(responseData => {
                        console.log("sucess==>");
                      console.log(responseData._bodyText);
                      console.log(responseData);
                      alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
                    }).catch(err => {
                        console.log("err==>");
                        //alert("Error with image upload!")
                        console.log(err);
                    });
        }
    }
      });
    }
  render() {
    return (
      <View style={styles.container}>
<Button
  onPress={this.onClickButton}
  title="Select image"
  color="#841584"
/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
