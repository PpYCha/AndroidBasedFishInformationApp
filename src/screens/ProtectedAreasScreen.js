import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import CustomInput from '../components/CustomInput';
import {getCurrentTimestamp} from 'react-native/Libraries/Utilities/createPerformanceLogger';
import CustomButton from '../components/CustomButton';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {AuthContext} from '../context/AuthContext';

const ProtectedAreasScreen = ({navigation, route}) => {
  const [municipality, setMunicipality] = useState();
  const [protectedAreas, setProtectedAreas] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [coordinates, setCoordinates] = useState([{}]);
  const [selectedId, setSelectedId] = useState(null);
  const [table, setTable] = useState({table: ['Latitude', 'Longitude']});

  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [typeOfUser, setTypeOfUser] = useState('');

  const {
    municipality1,
    latitude1,
    longitude1,
    protectedAreas1,
    protectedAreasId,
  } = route.params;

  console.log(coordinates);

  const handleSave = () => {
    if (typeof protectedAreasId === 'undefined') {
      saveArea();
    } else {
      updateArea();
    }
  };

  const saveArea = async () => {
    await firestore()
      .collection('protectedArea')
      .doc()
      .set({
        municipality: municipality,
        nameOfProtected: protectedAreas,
        // coordinates: coordinates,
        latitude: latitude,
        longitude: longitude,
      })
      .then(() => {
        Alert.alert('Protected Area Info', 'Succesfully Saved', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);
      })

      .catch(error => {
        console.log(
          'Something went wrong with added user to firestore: ',
          error,
        );
      });
  };

  const updateArea = async () => {
    await firestore()
      .collection('protectedArea')
      .doc(protectedAreasId)
      .set({
        municipality: municipality,
        nameOfProtected: protectedAreas,
        // coordinates: coordinates,
        latitude: latitude,
        longitude: longitude,
      })
      .then(() => {
        Alert.alert('Protected Area Info', 'Succesfully Saved', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);
      })

      .catch(error => {
        console.log(
          'Something went wrong with added user to firestore: ',
          error,
        );
      });
  };

  const handleDelete = async () => {
    await firestore()
      .collection('protectedArea')
      .doc(protectedAreasId)
      .delete()
      .then(() => {
        console.log('User deleted!');
        navigation.navigate('ProtectedAreasScreenList');
      });
  };

  useEffect(() => {
    getUserDetails();
    try {
      setMunicipality(municipality1);
      setProtectedAreas(protectedAreas1);
      setLatitude(latitude1);
      setLongitude(longitude1);
    } catch (error) {}
  }, []);

  const getUserDetails = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          const {typeofUser} = documentSnapshot.data();
          setTypeOfUser(typeofUser);
        }
      });
    console.log(typeOfUser);
    if (loading) {
      setLoading(false);
    }
  };

  return (
    <View>
      <CustomInput
        text="Municipality"
        value={municipality}
        onChangeText={text => setMunicipality(text)}
      />
      <CustomInput
        text="Name of Marine Protected Areas/ Fish Sanctuaries"
        value={protectedAreas}
        onChangeText={text => setProtectedAreas(text)}
      />
      <CustomInput
        text="Latitude"
        value={latitude}
        onChangeText={text => setLatitude(text)}
      />
      <CustomInput
        text="Longitude"
        value={longitude}
        onChangeText={text => setLongitude(text)}
      />

      {typeOfUser === 'admin' ? (
        <>
          <CustomButton
            text="SAVE"
            backgroundColor="#3AC786"
            onPress={handleSave}
          />
          <CustomButton
            text="DELETE"
            backgroundColor="red"
            onPress={handleDelete}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default ProtectedAreasScreen;

const styles = StyleSheet.create({
  containerLocation: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
    padding: 10,
    margin: 10,
  },
  containerTextInput: {},
  text: {
    fontSize: 20,
  },
  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },

  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
});
