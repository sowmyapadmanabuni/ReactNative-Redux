/*Custom Button*/
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Fonts } from '../src/utils/Fonts'

const Mybutton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.customClick}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    color: '#ffffff',
    padding: 10,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 35,
  },
  text: {
    color: '#000000',
    fontSize:17,
    fontFamily:Fonts.Tahoma, 
  },
});

export default Mybutton;
