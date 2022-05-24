import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Modal,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import {Marker, Circle, Overlay, Polygon, Polyline} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fishLogo from '../assets/fish.png';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [fishList, setfishList] = useState([]);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [protectedAreaList, setProtectedAreaList] = useState([]);

  const getFishList = async () => {
    try {
      const list = [];
      await firestore()
        .collection('fishInfo')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const id = doc.id;
            const {
              latitude,
              longitude,
              latitudeDelta,
              longitudeDelta,
              barangay,
              municipality,
              // fishImage,
              scientificName,
              kingdom,
              fishClass,
              phylum,
              order,
              fishFamily,
              genus,
              commonName,
              localName,
              environment,
              description,
              biology,
            } = doc.data();
            list.push({
              latitude,
              longitude,
              id,
              latitudeDelta,
              longitudeDelta,
              // fishImage,
              scientificName,
              kingdom,
              fishClass,
              phylum,
              order,
              fishFamily,
              genus,
              commonName,
              localName,
              environment,
              description,
              biology,
              barangay,
              municipality,
            });
          });
        });

      setfishList(list);
      // console.log('data:', list);
    } catch (e) {
      console.log(e);
    }
  };

  const getProtectedAreaList = async () => {
    try {
      const list = [];
      await firestore()
        .collection('protectedArea')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const id = doc.id;

            const {nameOfProtected, municipality, longitude, latitude} =
              doc.data();
            list.push({
              id,
              nameOfProtected,
              municipality,
              latitude,
              longitude,
            });
          });
        });

      setProtectedAreaList(list);
      console.log('area:', list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFishList();
    getProtectedAreaList();
  }, [isFocused]);

  const CustomMarker = () => {
    return (
      <>
        <MaterialCommunityIcons name="fish" size={50} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        mapType="hybrid"
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 12.50917,
          longitude: 124.636618,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {fishList.map((marker, index) => {
          console.log(
            marker.latitude,
            marker.longitude,
            marker.id,
            marker.commonName,
          );

          return (
            <>
              {!isNaN(marker.latitude) && !isNaN(marker.longitude) ? (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: Number(marker.latitude),
                    longitude: Number(marker.longitude),
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Fish Info',
                      'Fish Local Name:' +
                        marker.localName +
                        '\n' +
                        'Municipality:' +
                        marker.municipality +
                        '\n' +
                        'Barangay:' +
                        marker.barangay,
                    );
                  }}>
                  <CustomMarker />
                </Marker>
              ) : (
                <></>
              )}
            </>
          );
        })}

        {protectedAreaList.map((item, index) => {
          console.log('circle: ', item.latitude);
          console.log('circle: latied: ', item.longitude);
          return (
            <>
              {!isNaN(item.latitude) && !isNaN(item.longitude) ? (
                <Circle
                  style={styles.circle}
                  key={index}
                  center={{
                    latitude: Number(item.latitude),
                    longitude: Number(item.longitude),
                  }}
                  radius={250}
                  strokeColor="red"
                  strokeWidth={5}
                  lineCap="square"
                  lineJoin="bevel"
                />
              ) : (
                <></>
              )}
            </>
          );
        })}
      </MapView>

      <Image
        style={{
          height: 150,
          width: 150,
          position: 'absolute',
          alignItems: 'flex-end',
        }}
        source={require('../assets/legend.png')}
        resizeMode="contain"
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    opacity: 300,
  },
});
