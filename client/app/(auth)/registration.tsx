import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Button } from 'react-native-elements';
import React, { useState } from 'react'
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import hashPassword from '../utils/HashPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import $api from '../http';

export default function registration() {
    const { setUserId  } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    const handleRegistration = () => {
      const user = {
        name: username,
        email: email,
        password: hashPassword(password),
      };
    
      $api.post('/registration', user)
        .then((response: { status: number; data: { message: any; userData: { refreshToken: string; accessToken: string; user: { id: React.SetStateAction<string | null>; }; }; }; }) => {
          if (response.status === 400) {
            Alert.alert(
              'Wrong data',
              `${response.data.message}`
          );
          } else {
            Alert.alert(
              'Registration done!',
              'Open latter on your email'
            );
    
            setEmail('');
            setUsername('');
            setPassword('');
            
            AsyncStorage.setItem('authToken', response.data.userData.refreshToken);
            AsyncStorage.setItem("token", response.data.userData.accessToken);
            
            setUserId(response.data.userData.user.id);
            router.replace('login');
          }
        })
        .catch((error: { response: { data: { message: any; }; }; }) => {
          Alert.alert(
            'Registration error',
            `${error.response.data.message}`
        );
        });
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.Text}>
            {"Welcome!"}
          </Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.inputContainer}
          />
          <Pressable onPress={() => router.push('login')}>
            <Text style={{ textAlign: 'center', color: 'gray' }}>
              Already have account?{' '}
              <Text style={{ color: 'blue' }}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
        <View style={styles.formContainer}>
          <Button
              title="SIGN UP"
              buttonStyle={styles.button}
              onPress={handleRegistration}
            />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    Text: {
      fontSize: 50,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 50,
    },
    formContainer: {
      marginTop: 50,
      width: '80%',
    },
    inputContainer: {
      fontSize: 20,
      marginBottom: 20,
      paddingStart: 10,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 10,
      height: 50,
    },
    button: {
      marginBottom: 50,
      backgroundColor: '#257CFF',
      borderRadius: 30,
      width: '100%',
      height: 50,
    },
});