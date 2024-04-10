import { Alert, Keyboard, SafeAreaView, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-elements';
import $api from '../../../http';
import hashPassword from '../../../utils/HashPassword';
import { styles } from '../styles';

const NewPasswordForm = ({navigation, route}: any) => {
    const {email} = route.params;
    const [password, setPassword] = useState<string>('');
    const [repeat_password, setRepeat_Password] = useState<string>('');

    const resetPassword = () => {
        if(!password || !repeat_password) return;

        if(password.length < 4) {
          Alert.alert('Минимальная длина пароля 4 символа');
          return;
        }
    
        if(password !== repeat_password) {
          Alert.alert('Ошибка', 'Пароли не совпадают');
          return;
        }
    
        try {
          console.log(email);
          const password_hashed = hashPassword(password);
          $api.post('/reset', {email: email, password: password_hashed})
            .then(response => {
              console.log(response);
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
              title="Изменить пароль"
              buttonStyle={styles.button}
              onPress={resetPassword}
            />
        </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    )
}

export default NewPasswordForm