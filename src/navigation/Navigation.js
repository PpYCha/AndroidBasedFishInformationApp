import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FishListScreen from '../screens/FishListScreen';
import ScanFishScreen from '../screens/ScanFishScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FishInfoScreen from '../screens/FishInfoScreen';
import {AuthContext} from '../context/AuthContext';
import SearchFishScreen from '../screens/SearchFishScreen';
import ProtectedAreasScreen from '../screens/ProtectedAreasScreen';
import ProtectedAreasScreenList from '../screens/ProtectedAreasScreenList';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const FishStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="FishListScreen"
      component={FishListScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="FishInfoScreen"
      component={FishInfoScreen}
      options={{
        title: 'Fish Information',
      }}
    />
  </Stack.Navigator>
);

const ProtectedAreas = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProtectedAreasScreenList"
      component={ProtectedAreasScreenList}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ProtectedAreasScreen"
      component={ProtectedAreasScreen}
      options={{
        title: 'Protected Areas Information',
      }}
    />
  </Stack.Navigator>
);

const Navigation = () => {
  const {user, setUser, logout} = useContext(AuthContext);
  return (
    <>
      <Tab.Navigator
        initialRouteName="ProtectedAreasScreenList"
        activeColor="white"
        barStyle={{backgroundColor: 'tomato'}}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => (
              <FontAwesome5 name="map-marked-alt" color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Fish"
          component={FishStack}
          options={{
            tabBarLabel: 'Fish',
            tabBarIcon: ({color}) => (
              <FontAwesome5 name="fish" color={color} size={20} />
            ),
          }}
        />

        <Tab.Screen
          name="ProtectedAreas"
          component={ProtectedAreas}
          options={{
            tabBarLabel: 'Protected Areas',
            tabBarIcon: ({color}) => (
              <FontAwesome5 name="map-signs" color={color} size={20} />
            ),
          }}
        />

        <Tab.Screen
          name="Search1"
          component={SearchFishScreen}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({color}) => (
              <FontAwesome5 name="heart" color={color} size={20} />
            ),
          }}
        />

        <Tab.Screen
          name="Logout"
          component={FishListScreen}
          onPress={() => {
            console.log('hello');
          }}
          options={{
            tabBarLabel: 'Logout',
            tabBarIcon: ({color}) => (
              <FontAwesome5 name="sign-out-alt" color={color} size={20} />
            ),
          }}
          listeners={({navigation}) => ({
            tabPress: e => {
              // Prevent default action
              e.preventDefault();

              // Do something with the `navigation` object
              logout();
            },
          })}
        />
      </Tab.Navigator>
    </>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
