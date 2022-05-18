import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import Navigation from './Navigation';
import {AuthContext} from '../context/AuthContext';
import auth from '@react-native-firebase/auth';

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);

  const onAuthStateChanged = user => {
    setUser(user);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      {user ? <Navigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
};

export default Routes;

const styles = StyleSheet.create({});
