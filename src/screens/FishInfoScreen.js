import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import dataOrder from '../data/dataOrder';
import dataFamily from '../data/dataFamily';
import dataGenus from '../data/dataGenus';
import familys from '../data/dataFamily';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

import {AuthContext} from '../context/AuthContext';

const FishInfoScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [typeOfUser, setTypeOfUser] = useState('');

  const [fishId, setFishId] = useState();
  const [fishImage, setFishImage] = useState('');
  const [latitude, setlatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [kingdom, setKingdom] = useState('Animalia');
  const [fishClass, setFishClass] = useState('Actinopterygii');
  const [phylum, setPhylum] = useState('Chordata');
  const [municipality, setMunicipality] = useState();
  const [barangay, setBarangay] = useState();

  //dropdown Order
  const [order, setOrder] = useState();
  const [openOrder, setOpenOrder] = useState(false);

  //dropdown Family
  const [fishFamily, setFishFamily] = useState();
  const [openFamily, setOpenFamily] = useState(false);

  //dropdown Genus
  const [genus, setGenus] = useState();
  const [openGenus, setOpenGenus] = useState(false);

  const [image, setImage] = useState();
  const [transferred, setTransferred] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [commonName, setCommonName] = useState('');
  const [localName, setLocalName] = useState('');
  const [environment, setEnvironment] = useState('');
  const [description, setDescription] = useState('');
  const [biology, setBiology] = useState('');

  const {
    fishImage1,
    fishId1,
    scientificName1,
    kingdom1,
    fishClass1,
    phylum1,
    order1,
    fishFamily1,
    genus1,
    commonName1,
    localName1,
    environment1,
    description1,
    biology1,
    longitude1,
    latitude1,
    latitudeDelta1,
    longitudeDelta1,
    municipality1,
    barangay1,
  } = route.params;

  useEffect(() => {
    getUserDetails();
    try {
      setFishId(fishId1);
      setFishImage(fishImage1);

      setScientificName(scientificName1);
      setKingdom(kingdom1);
      setFishClass(fishClass1);
      setPhylum(phylum1);
      setOrder(order1);
      setFishFamily(fishFamily1);
      setGenus(genus1);
      setCommonName(commonName1);
      setLocalName(localName1);
      setEnvironment(environment1);
      setDescription(description1);
      setBiology(biology1);

      setLongitude(longitude1);
      setlatitude(latitude1);
      setMunicipality(municipality1);
      setBarangay(barangay1);
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

  const handleSave = () => {
    if (typeof fishId === 'undefined') {
      saveFish();
    } else {
      updateFish();
    }
  };

  const saveFish = async () => {
    const imageUrl = await uploadImage();
    if (imageUrl === null) {
      imageUrl: '';
    }
    await firestore()
      .collection('fishInfo')
      .doc()
      .set({
        fishImage: imageUrl,

        scientificName: scientificName,
        commonName: commonName,
        localName: localName,

        kingdom: kingdom,
        fishClass: fishClass,
        phylum: phylum,
        order: order,
        fishFamily: fishFamily,
        genus: genus,

        environment: environment,
        description: description,
        biology: biology,
        longitude: longitude,
        latitude: latitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        municipality: municipality,
        barangay: barangay,
      })
      .then(() => {
        Alert.alert('Fish Info', 'Succesfully Saved', [
          {text: 'OK', onPress: () => navigation.navigate('FishListScreen')},
        ]);
      })

      .catch(error => {
        console.log(
          'Something went wrong with added user to firestore: ',
          error,
        );
      });
  };

  const updateFish = async () => {
    const imageUrl = await uploadImage();
    if (imageUrl === null) {
      imageUrl: '';
    }
    await firestore()
      .collection('fishInfo')
      .doc(fishId)
      .set({
        fishImage: imageUrl,

        scientificName: scientificName,
        commonName: commonName,
        localName: localName,
        lower_myData_insensitive: localName.toLowerCase(),
        upper_myData_insensitive: localName.toUpperCase(),
        kingdom: kingdom,
        fishClass: fishClass,
        phylum: phylum,
        order: order,
        fishFamily: fishFamily,
        genus: genus,

        environment: environment,
        description: description,
        biology: biology,
        longitude: longitude,
        latitude: latitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        municipality: municipality,
        barangay: barangay,
      })
      .then(() => {
        Alert.alert('Fish Info', 'Succesfully Saved', [
          {text: 'OK', onPress: () => navigation.navigate('FishListScreen')},
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
      .collection('fishInfo')
      .doc(fishId)
      .delete()
      .then(() => {
        console.log('User deleted!');
        navigation.navigate('FishListScreen');
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      mediaType: 'photo',
      cropping: false,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    true;
    setTransferred(0);
    setUploading;

    const storageRef = storage().ref(`photos/profile/${filename}`);
    const task = storageRef.putFile(uploadUri);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }

    setImage(null);
  };

  return (
    <ScrollView nestedScrollEnabled={true}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={choosePhotoFromLibrary}>
            <Image
              style={styles.image}
              source={{
                uri: fishImage
                  ? fishImage
                  : 'https://firebasestorage.googleapis.com/v0/b/androidbasedfishinformat-3bd05.appspot.com/o/avatar-default.png?alt=media&token=fabf4cff-2eba-4536-ad58-e8ac456d6e56'
                  ? image ||
                    'https://firebasestorage.googleapis.com/v0/b/androidbasedfishinformat-3bd05.appspot.com/o/avatar-default.png?alt=media&token=fabf4cff-2eba-4536-ad58-e8ac456d6e56'
                  : 'https://firebasestorage.googleapis.com/v0/b/androidbasedfishinformat-3bd05.appspot.com/o/avatar-default.png?alt=media&token=fabf4cff-2eba-4536-ad58-e8ac456d6e56',
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.containerName}>
          <Text style={styles.containerHeaderText}>Different Names</Text>
          <CustomInput
            text="Scientific Name:"
            value={scientificName}
            onChangeText={text => setScientificName(text)}
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
        </View>

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
          style={styles.dropDonwPicker}
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
          style={styles.dropDonwPicker}
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
          style={styles.dropDonwPicker}
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

        <View style={styles.locationContainer}>
          <Text style={styles.containerHeaderText}>Location:</Text>
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
            text="Municipality:"
            value={municipality}
            onChangeText={text => setMunicipality(text)}
          />
          <CustomInput
            text="Barangay:"
            value={barangay}
            onChangeText={text => setBarangay(text)}
          />
        </View>
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
  image: {
    flex: 1,
    width: 250,
    height: 250,
    resizeMode: 'center',
    borderRadius: 10,
  },
  locationContainer: {
    backgroundColor: 'gray',
  },
  containerHeaderText: {
    fontSize: 40,
    fontWeight: '800',
  },
  containerName: {
    backgroundColor: '#888888',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',

    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  dropDonwPicker: {
    padding: 10,
    // margin: 10,
  },
});
