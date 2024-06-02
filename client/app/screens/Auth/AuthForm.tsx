import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import hashPassword from '../../utils/HashPassword';
import $api from '../../http';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import { useAuth } from '../../contexts/AuthContext';
import { primaryColor } from '../../constants/Colors';
import { styles } from './styles';

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
    if(!username || !password) return;
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
        Alert.alert("Ошибка входа", "Неверный формат данных");
      }
    }).catch((error) => {
      Alert.alert(
        "Ошибка входа",
        "Неверный логин или пароль"
      );
    });
  }

  if (isLoading) {
    return (
      <View style={stylesLoading.containerLoading}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={[styles.container, {marginTop: 20}]}>
        <View style={styles.formContainer}>
          <Text style={[styles.Text, {fontSize: 50}]}>
            {"Crypto Learn"}
          </Text>
          <TextInput
            placeholder="Логин"
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Пароль"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.inputContainer}
          />
          <Pressable onPress={() => navigation.navigate('Reset')}>
            <Text style={{ textAlign: 'center', color: 'gray' }}>
                Забыли пароль?{' '}
              <Text style={{ color: primaryColor }}>Восстановить</Text>
            </Text>
          </Pressable>
          <Pressable style={{marginTop: 30}} onPress={() => navigation.navigate('Register')}>
              <Text style={{ textAlign: 'center', color: 'gray' }}>
                Нет аккаунта?{' '}
              <Text style={{ color: primaryColor }}>Создать</Text>
            </Text>
          </Pressable>
        </View>
        <View style={styles.formContainer}>
          <Button
              title="ВОЙТИ"
              buttonStyle={styles.button}
              onPress={handleAuthorize}
            />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const stylesLoading = StyleSheet.create({
  containerLoading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
});

export default AuthForm;
