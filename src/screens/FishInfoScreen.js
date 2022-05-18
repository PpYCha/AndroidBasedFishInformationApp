import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import dataOrder from '../data/dataOrder';
import dataFamily from '../data/dataFamily';
import dataGenus from '../data/dataGenus';
import familys from '../data/dataFamily';

const FishInfoScreen = ({navigation, route}) => {
  const [fishImage, setFishImage] = useState('');
  const [latitude, setlatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [kingdom, setKingdom] = useState('Animalia');
  const [fishClass, setFishClass] = useState('Actinopterygii');
  const [phylum, setPhylum] = useState('Chordata');

  //dropdown Order
  const [order, setOrder] = useState();
  const [openOrder, setOpenOrder] = useState(false);

  //dropdown Family
  const [fishFamily, setFishFamily] = useState();
  const [openFamily, setOpenFamily] = useState(false);

  //dropdown Genus
  const [genus, setGenus] = useState();
  const [openGenus, setOpenGenus] = useState(false);

  const [commonName, setCommonName] = useState('');
  const [localName, setLocalName] = useState('');
  const [environment, setEnvironment] = useState('');
  const [description, setDescription] = useState('');
  const [biology, setBiology] = useState('');

  const {fishImage1, latitude1} = route.params;

  useEffect(() => {
    setFishImage(fishImage1);
    setlatitude(latitude1);
  }, []);

  const handleSave = async () => {
    await firestore()
      .collection('fishInfo')
      .doc()
      .set({
        fishImage: fishImage,

        scientificName: scientificName,
        kingdom: kingdom,
        fishClass: fishClass,
        phylum: phylum,
        order: order,
        fishFamily: fishFamily,
        genus: genus,
        commonName: commonName,
        localName: localName,
        environment: environment,
        description: description,
        biology: biology,
        longitude: longitude,
        latitude: latitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
      .then(() => {
        Alert.alert('Fish Info', 'Succesfully Saved', [
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

  return (
    <ScrollView nestedScrollEnabled={true}>
      <View style={styles.container}>
        <CustomInput
          text="Fish Image:"
          value={fishImage}
          onChangeText={text => setFishImage(text)}
        />
        <CustomInput
          text="Latitude:"
          value={latitude}
          onChangeText={text => setlatitude(text)}
        />
        <CustomInput
          text="Longitude:"
          value={longitude}
          onChangeText={text => setLongitude(text)}
        />
        <CustomInput
          text="Scientific Name:"
          value={scientificName}
          onChangeText={text => setScientificName(text)}
        />
        <CustomInput
          text="Kingdom:"
          value={kingdom}
          onChangeText={text => setKingdom(text)}
        />
        <CustomInput
          text="Class:"
          value={fishClass}
          onChangeText={text => setFishClass(text)}
        />
        <CustomInput
          text="Phylum:"
          value={phylum}
          onChangeText={text => setPhylum(text)}
        />
        <DropDownPicker
          listMode="MODAL"
          open={openOrder}
          value={order}
          items={dataOrder}
          setOpen={setOpenOrder}
          setValue={setOrder}
          setItems={dataOrder}
          placeholder="Select Order"
        />
        <DropDownPicker
          listMode="MODAL"
          open={openFamily}
          value={fishFamily}
          items={dataFamily}
          setOpen={setOpenFamily}
          setValue={setFishFamily}
          setItems={dataFamily}
          placeholder="Select Family"
        />

        <DropDownPicker
          listMode="MODAL"
          open={openGenus}
          value={genus}
          items={dataGenus}
          setOpen={setOpenGenus}
          setValue={setGenus}
          setItems={dataGenus}
          placeholder="Select Genus"
        />

        <CustomInput
          text="Common Name:"
          value={commonName}
          onChangeText={text => setCommonName(text)}
        />
        <CustomInput
          text="Local Name:"
          value={localName}
          onChangeText={text => setLocalName(text)}
        />
        <CustomInput
          text="Environment:"
          value={environment}
          onChangeText={text => setEnvironment(text)}
        />
        <CustomInput
          text="Description:"
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <CustomInput
          text="Biology:"
          value={biology}
          onChangeText={text => setBiology(text)}
        />
        <CustomButton
          text="SAVE"
          backgroundColor="#3AC786"
          onPress={handleSave}
        />
      </View>
    </ScrollView>
  );
};

export default FishInfoScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,

    flex: 1,
  },
});
