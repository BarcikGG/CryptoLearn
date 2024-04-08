import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native';
import hashPassword from '../../utils/HashPassword';
import $api from '../../http';
import { primaryColor } from '../../constants/Colors';

const RegistrationForm = ({ navigation }: any) => {
  const [code, setCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeat_password, setRepeat_Password] = useState<string>('');
  const [correct_code, setCorrectCode] = useState<string>('');
  const [isSend, setIsSend] = useState<boolean>(false);

  const sendLink = async() => {
    if(!email) return;

    try {
      const response = await $api.get(`/send-code/${email}`)
      console.log(response.data)
      setCorrectCode(response.data);
      setIsSend(true);
    } catch {
      Alert.alert('Ошибка', 'Не удалось отправить код, почта не найдена')
    }
  }

  const resetPassword = () => {
    if(!code || !password || !repeat_password) return;

    console.log(code, correct_code)
    if(correct_code != code) {
      Alert.alert('Неверный код!', 'Проверьте почту или отправьте код повторно');
      return;
    }

    if(password !== repeat_password) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    try {
      const password_hashed = hashPassword(password);
      $api.post('/reset', {email: email, password: password_hashed})
        .then(response => {
          if (response.status !== 200) {
            Alert.alert(
              'Неверные данные',
              `${response.data.message}`
          );
          } else {
            Alert.alert(
              'Пароль обновлен!',
              'Войдите в аккаунт'
            );
    
            setEmail('');
            setCode('');
            setPassword('');
            setRepeat_Password('');
            
            navigation.replace('Login');
          }
        })
    } catch {
      Alert.alert('Ошибка обновления', 'Длина пароля от 4 до 18 символов')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.Text}>
            {"Восстановление пароля"}
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputContainer}
          />
          <Pressable style={{marginBottom: 40}} onPress={sendLink} disabled={isSend}>
            <Text style={{ textAlign: 'center', color: !isSend ? primaryColor : 'gray' }}>
              {!isSend ? 'Отправить код на почту' : 'Код отправлен'}
            </Text>
          </Pressable>

          <TextInput
            placeholder="Код восстановления"
            value={code}
            keyboardType='numeric'
            maxLength={4}
            onChangeText={text => setCode(text)}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Новый пароль"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Повторите пароль"
            secureTextEntry
            value={repeat_password}
            onChangeText={text => setRepeat_Password(text)}
            style={styles.inputContainer}
          />
        </View>
        <View style={styles.formContainer}>
          <Button
              title="Сменить пароль"
              buttonStyle={styles.button}
              onPress={resetPassword}
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
    fontSize: 24,
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
