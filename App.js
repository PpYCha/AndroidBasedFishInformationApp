import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Routes from './src/navigation/Routes';
import {AuthProvider} from './src/context/AuthContext';

const App = () => {
  return (
    <>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      {/* <View>
        <Text>Hello</Text>
      </View> */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
