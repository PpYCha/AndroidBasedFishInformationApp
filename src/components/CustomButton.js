import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const CustomButton = ({text, backgroundColor, onPress, ...rest}) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.container, {backgroundColor: backgroundColor}]}
        onPress={onPress}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#446CB4',
    padding: 10,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
