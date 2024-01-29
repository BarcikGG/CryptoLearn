import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import hashPassword from '../../utils/HashPassword';
import $api from '../../http';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import decodeToken from '../../utils/decodeToken';
import { useAuth } from '../../contexts/AuthContext';
import Colors, { primaryColor } from '../../constants/Colors';

const AuthForm = ({ navigation }: any) => {
  const { userId, setUserId  } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('authToken');
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/refresh`, { refreshToken });
          AsyncStorage.setItem('token', response.data.userData.accessToken);
          AsyncStorage.setItem('userID', response.data.userData.user.id.toString());
          
          navigation.replace('Main');
        }
      } catch (error) {
        console.log('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuthentication();
  }, []);
  
  const handleAuthorize = () => {
    $api.post('/login', {username: username, password: hashPassword(password)}).then(async response => {
      if (response.data) {
        AsyncStorage.setItem("authToken", response.data.userData.refreshToken);
        AsyncStorage.setItem("token", response.data.userData.accessToken);
        AsyncStorage.setItem('userID', response.data.userData.user.id.toString());
        setUserId(response.data.userData.user.id);

        setUsername("");
        setPassword("");

        navigation.replace('Main');
      } else {
        console.error("Invalid response format", response);
        Alert.alert("Login error", "Invalid response format");
      }
    }).catch((error) => {
      Alert.alert(
        "Invalid credentails",
        "Неверный логин или пароль"
      );
      console.log(error);
    });
  }

  if (isLoading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.Text}>
          {"Welcome to crypto learn!"}
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
        <Pressable onPress={() => navigation.navigate('Register')}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 20
  },
  Text: {
    fontSize: 50,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 50,
  },
  formContainer: {
    marginTop: 20,
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

export default AuthForm;
