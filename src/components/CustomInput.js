import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';

const CustomInput = ({text, onChangeText, value, secureTextEntry, ...rest}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{text}</Text>

        <TextInput
          style={styles.input}
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
        />
      </View>
    </>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 5,
    backgroundColor: '#E4E6EB',
    borderRadius: 10,
  },
  input: {
    height: 40,
    margin: 5,
    borderBottomWidth: 0.5,
    padding: 5,
    color: 'black',
  },
  label: {
    color: 'black',
  },
});
