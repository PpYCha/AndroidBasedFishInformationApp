import React, {useContext, useState, createContext} from 'react';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,

        login: async (email, password) => {
          try {
            if (email === ' ' || password === ' ') {
              Alert.alert('Alert!', 'Please input your email and password.');
            } else {
              await auth().signInWithEmailAndPassword(email, password);
              console.log('succesfully login');
            }
          } catch (e) {
            console.log(e);
            Alert.alert('Alert!', `${e.message}`);
          }
        },

        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
        resetPassword: async email => {
          await auth()
            .sendPasswordResetEmail(email)
            .then(function (user) {
              alert('Please check your email...');
            })
            .catch(function (e) {
              console.log(e);
            });
        },
        register: async (email, password, typeofUser, name) => {
          console.log('Check sa type of user:', typeofUser);

          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    name: name,
                    email: email,
                    typeofUser: typeofUser,
                    createdAt: firestore.Timestamp.fromDate(new Date()),

                    isActive: 'true',
                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                Alert.alert('Something went wrong with sign up', `${error}`);
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
}
