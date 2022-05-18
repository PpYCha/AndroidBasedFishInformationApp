import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useContext} from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {AuthContext} from '../context/AuthContext';

const CreateUserScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState();
  const [typeofUser, setTypeofUser] = useState('admin');
  const {register} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Register</Text>
      <CustomInput
        text="Email Address"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <CustomInput
        text="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />
      <CustomInput
        text="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <CustomButton
        text="REGISTER"
        onPress={() => {
          if (email != '' || password != '') {
            register(email, password, typeofUser, name);
          } else {
            Alert.alert('Please input your password or email');
          }
        }}
        backgroundColor="#446CB4"
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LoginScreen');
        }}>
        <Text style={[styles.bottomText, {color: '#488DC5'}]}>
          Already have an account?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateUserScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    // margin: 5,
    // padding: 5,
    flex: 1,
  },
  headerText: {
    fontWeight: '300',
    fontSize: 40,
    marginBottom: 20,
    color: 'black',
  },
  bottomText: {
    textAlign: 'center',
    margin: 10,
    color: 'black',
  },
});
