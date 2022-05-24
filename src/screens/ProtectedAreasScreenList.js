import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import CustomButton from '../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';

const ProtectedAreasScreenList = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [typeOfUser, setTypeOfUser] = useState('');
  const isFocused = useIsFocused();

  const [selectedId, setSelectedId] = useState(null);
  const [areasList, setAreasList] = useState();

  useEffect(() => {
    getUserDetails();
    getAreaList();
  }, [isFocused]);

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

  const getAreaList = async () => {
    try {
      const list = [];
      await firestore()
        .collection('protectedArea')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const id = doc.id;
            const {latitude, longitude, nameOfProtected, municipality} =
              doc.data();
            list.push({
              id,
              latitude,
              longitude,
              nameOfProtected,
              municipality,
            });
          });
        });

      setAreasList(list);

      // console.log('data:', list);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({item, index}) => {
    // console.log('item:', item.fishFamily);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('ProtectedAreasScreen', {
            protectedAreas1: item.nameOfProtected,
            protectedAreasId: item.id,
            longitude1: item.longitude,
            latitude1: item.latitude,
            municipality1: item.municipality,
          })
        }>
        <Image source={{uri: item.fishImage}} style={styles.image} />
        <Text style={styles.title}>{item.nameOfProtected}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topViewContainer}>
        {typeOfUser === 'admin' ? (
          <>
            <CustomButton
              text="Add Protected Areas Info"
              backgroundColor="green"
              onPress={() => {
                navigation.navigate('ProtectedAreasScreen');
              }}
            />
          </>
        ) : (
          <></>
        )}
      </View>
      <FlatList
        data={areasList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </View>
  );
};

export default ProtectedAreasScreenList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 5,
    flex: 1,
    padding: 5,
    margin: 5,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7F5F',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    color: 'black',
    alignItems: 'center',
    fontSize: 20,
    marginLeft: 30,
  },
  buttonContainer: {},

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  topViewContainer: {
    marginBottom: 10,
  },
  searchBar: {
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
