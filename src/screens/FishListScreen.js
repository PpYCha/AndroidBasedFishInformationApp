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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomButton from '../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';

const FishListScreen = ({navigation}) => {
  const [fishList, setfishList] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(null);

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
              latitude,
              longtitude,
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
              id,
              fishImage,
              latitude,
              longtitude,
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

  const renderItem = ({item, index}) => {
    console.log('selected: ', index, selectedId);
    console.log('item:', item.id);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('FishInfoScreen', {
            fishImage1: item.fishImage,
            latitude1: item.latitude,
          })
        }>
        <Text style={styles.title}>
          {item.commonName} -- {item.scientificName}
        </Text>
      </TouchableOpacity>
    );
  };

  // const handleSelectedItem = ({item}) => {
  //   setModalVisible(true);
  //   console.log(item);
  //   console.log(modalVisible);
  //   return (
  //     <>
  //       <Modal
  //         animationType="slide"
  //         transparent={true}
  //         visible={modalVisible}
  //         onRequestClose={() => {
  //           Alert.alert('Modal has been closed.');
  //           setModalVisible(!modalVisible);
  //         }}>
  //         <View style={styles.centeredView}>
  //           <View style={styles.modalView}>
  //             <Text style={styles.modalText}>{item.commonName}</Text>
  //             <Pressable
  //               style={[styles.button, styles.buttonClose]}
  //               onPress={() => setModalVisible(!modalVisible)}>
  //               <Text style={styles.textStyle}>Hide Modal</Text>
  //             </Pressable>
  //           </View>
  //         </View>
  //       </Modal>
  //     </>
  //   );
  // };

  return (
    <View style={styles.container}>
      <FlatList
        data={fishList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />

      <CustomButton
        text="Add Fish Info"
        backgroundColor="green"
        onPress={() => {
          navigation.navigate('FishInfoScreen');
        }}
      />
    </View>
  );
};

export default FishListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 10,
    flex: 1,
    padding: 10,
    margin: 10,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  title: {
    fontSize: 20,
    color: 'black',
    alignItems: 'center',
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
});
