import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fishLogo from '../assets/fish.png';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [fishList, setfishList] = useState([]);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);

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
            });
          });
        });

      setfishList(list);
      // console.log('data:', list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFishList();
  }, [isFocused]);

  const renderItem = ({item}) => {
    console.log(item.latitude, item.longtitude);
    return (
      <>
        <Marker coordinate={{latitude: 12.50917, longitude: 124.636618}}>
          <CustomMarker />
        </Marker>
      </>
    );
  };

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
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 12.50917,
          longitude: 124.636618,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {/* <Marker
          title={tokyoRegion.title}
          description={tokyoRegion.description}
          coordinate={{
            latitude: tokyoRegion.latitude,
            longitude: tokyoRegion.longitude,
          }}
        /> */}
        {fishList.map((marker, index) => {
          console.log(
            marker.latitude,
            marker.longitude,
            index,
            marker.commonName,
          );

          return (
            <>
              {!isNaN(marker.latitude) && !isNaN(marker.longitude) ? (
                <Marker
                  key={index}
                  title={marker.commonName}
                  coordinate={{
                    latitude: Number(marker.latitude),
                    longitude: Number(marker.longitude),
                  }}>
                  <CustomMarker />
                </Marker>
              ) : (
                <></>
              )}
            </>
          );
        })}
      </MapView>
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
});
