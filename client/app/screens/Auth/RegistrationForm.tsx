import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native';
import hashPassword from '../../utils/HashPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import $api from '../../http';
import { useAuth } from '../../contexts/AuthContext';
import { primaryColor } from '../../constants/Colors';

const RegistrationForm = ({ navigation }: any) => {
  const { setUserId  } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleRegistration = () => {
    if(!username || !password || !email) return;
    if(password.length < 4) {
      Alert.alert('Минимальная длина пароля 4 символа');
      return;
    }

    $api.post('/registration', {username: username, email: email, password: hashPassword(password)})
      .then(response => {
        if (response.data.userData.status == 400) {
          Alert.alert(
            'Неверные данные',
            `${response.data.userData.message}`
        );
        } else {
          Alert.alert(
            'Регистрация выполнена!',
            'Откройте письмо на почте'
          );
  
          setEmail('');
          setUsername('');
          setPassword('');
          
          AsyncStorage.setItem('authToken', response.data.userData.refreshToken);
          AsyncStorage.setItem("token", response.data.userData.accessToken);
          AsyncStorage.setItem('userID', response.data.userData.user.id.toString());    
          setUserId(response.data.userData.user.id);
          
          navigation.replace('Login');
        }
      })
      .catch(error => {
        console.log(error.response.data.errors[0].msg);
        Alert.alert(
          'Ошибка регистрации',
          `${error.response.data.errors[0].msg}`
      );
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.Text}>
            {"Создание аккаунта"}
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
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={{ textAlign: 'center', color: 'gray' }}>
              Уже есть аккаунт?{' '}
              <Text style={{ color: 'blue' }}>Войти</Text>
            </Text>
          </Pressable>
        </View>
        <View style={styles.formContainer}>
          <Button
              title="РЕГИСТРАЦИЯ"
              buttonStyle={styles.button}
              onPress={handleRegistration}
            />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  Text: {
    fontSize: 32,
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
});


export default RegistrationForm;
