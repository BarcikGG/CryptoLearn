import { Alert, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { Button } from 'react-native-elements';
import React, { useState } from 'react'
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import hashPassword from '../utils/HashPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import $api from '../http';
import Colors, { primaryColor } from '../../constants/Colors';

export default function login() {
  const { userId, setUserId  } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleAuthorize = () => {
    const user = {
      name: username,
      password: hashPassword(password)
    }

    $api.post('/login', user).then(async (response: { data: { userData: { refreshToken: string; accessToken: string; user: { id: string; }; }; }; }) => {
      if (response.data) {
        AsyncStorage.setItem("authToken", response.data.userData.refreshToken);
        AsyncStorage.setItem("token", response.data.userData.accessToken);
        AsyncStorage.setItem('userID', response.data.userData.user.id);

        setUsername("");
        setPassword("");

        const userId = await AsyncStorage.getItem('userID');
        setUserId(userId);

        //navigation.replace('Main');
      } else {
        console.error("Invalid response format", response);
        Alert.alert("Login error", "Invalid response format");
      }
    }).catch((error: any) => {
      Alert.alert(
        "Invalid credentails",
        "Wrong username or password"
      );
      console.log(error);
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
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
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.inputContainer}
          />
          <Pressable onPress={() => router.push('registration')}>
            <Text style={{ textAlign: 'center', color: 'gray' }}>
              Don't have an account?{' '}
              <Text style={{ color: 'blue' }}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
        <View style={styles.formContainer}>
          <Button
            title="SIGN IN"
            buttonStyle={styles.button}
            onPress={handleAuthorize}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: primaryColor,
    borderRadius: 30,
    width: '100%',
    height: 50,
  },
  containerLoading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
});