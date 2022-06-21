import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  Button,
  Image,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import CustomButton from '../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import SearchBar from 'react-native-dynamic-search-bar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../context/AuthContext';

const FishListScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [typeOfUser, setTypeOfUser] = useState('');
  const isFocused = useIsFocused();

  const [fishList, setfishList] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState();
  const [searchFound, setSearchFound] = useState();

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
              fishImage,
              like,
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

              latitude,
              longitude,
              barangay,
              municipality,
            } = doc.data();
            list.push({
              id,
              fishImage,
              like,
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
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,

              latitude,
              longitude,
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

  useEffect(() => {
    getFishList();
    getUserDetails();
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

  const handleLike = async (id, like) => {
    console.log(id, like);
    await firestore()
      .collection('fishInfo')
      .doc(id)
      .update({
        like: like,
      })
      .catch(error => {
        console.log(
          'Something went wrong with added user to firestore: ',
          error,
        );
      });
  };

  const renderItem = ({item, index}) => {
    // console.log('item:', item.fishFamily);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('FishInfoScreen', {
            fishImage1: item.fishImage,
            fishId1: item.id,
            scientificName1: item.scientificName,
            kingdom1: item.kingdom,
            fishClass1: item.fishClass,
            phylum1: item.phylum,
            order1: item.order,
            fishFamily1: item.fishFamily,
            genus1: item.genus,
            commonName1: item.commonName,
            localName1: item.localName,
            environment1: item.environment,
            description1: item.description,
            biology1: item.biology,
            longitude1: item.longitude,
            latitude1: item.latitude,
            latitudeDelta1: 0.01,
            longitudeDelta1: 0.01,
            municipality1: item.municipality,
            barangay1: item.barangay,
          })
        }>
        <Image source={{uri: item.fishImage}} style={styles.image} />
        {typeof item.like === 'undefined' ? (
          <>
            <TouchableOpacity
              style={{padding: 5, margin: 5}}
              onPress={() => {
                handleLike(item.id, 'heart');
              }}>
              <FontAwesome name="heart-o" color="red" size={40} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={{padding: 5, margin: 5}}
              onPress={() => {
                handleLike(item.id, 'heart');
              }}>
              <FontAwesome name={item.like} color="red" size={40} />
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.title}>{item.localName}</Text>
      </TouchableOpacity>
    );
  };

  const searchFish = async text => {
    const list = [];

    await firestore()
      .collection('fishInfo')

      .orderBy('localName')

      .where('localName', '<=', search.toLowerCase())
      .where('localName', '>=', search.toUpperCase())

      .startAfter(search)
      .endBefore(search + '\uf8ff')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const fishId = doc.id;
          const {commonName, scientificName, localName} = doc.data();
          list.push({
            fishId,
            commonName,
            scientificName,
            localName,
          });
          console.log(doc.id, ' => ', doc.data());
        });
      });
    setfishList(list);
    console.log('line 17:', list);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topViewContainer}>
        <SearchBar
          style={styles.searchBar}
          placeholder="Search local fish"
          onSearchPress={searchFish}
          onChangeText={text => setSearch(text)}
          onClearPress={getFishList}
        />
        {typeOfUser === 'admin' ? (
          <>
            <CustomButton
              text="Add Fish Info"
              backgroundColor="green"
              onPress={() => {
                navigation.navigate('FishInfoScreen', {
                  fishImage1: '',
                  latitude1: '',
                });
              }}
            />
          </>
        ) : (
          <></>
        )}
      </View>
      <FlatList
        data={fishList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
      {fishList === undefined || fishList.length == 0 ? (
        <>
          <View>
            <Text>No Fish Found</Text>
          </View>
        </>
      ) : (
        <>
          <View>
            <Text>Fish Found</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default FishListScreen;

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
