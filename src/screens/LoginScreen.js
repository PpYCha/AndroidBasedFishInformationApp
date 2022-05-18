import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useContext} from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {AuthContext} from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Login</Text>
      <CustomInput
        text="Emaill Address"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <CustomInput
        text="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />
      <CustomButton
        text="LOGIN"
        backgroundColor="#446CB4"
        onPress={() => {
          if (email != '' || password != '') {
            login(email, password);
            console.log('if login pressed');
          } else {
            Alert.alert('Please input your password or email');
            console.log('else login pressed');
          }
        }}
      />
      <Text style={styles.bottomText}>Do you wish to register for a</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreateUserScreen');
        }}>
        <Text style={[styles.bottomText, {color: '#488DC5'}]}>new acount?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
    color: 'black',
  },
});
