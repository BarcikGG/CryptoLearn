import React, { useState } from 'react';
import { View, Text, Alert, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native';
import $api from '../../../http';
import { styles } from '../styles';

const RegistrationForm = ({ navigation }: any) => {
  const [code, setCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [correct_code, setCorrectCode] = useState<string>('');
  const [isSend, setIsSend] = useState<boolean>(false);
  const [isSending, SetIsSending] = useState<boolean>(false);

  const sendLink = async() => {
    if(!email) return;
    SetIsSending(true);

    try {
      const response = await $api.get(`/send-code/${email}`)
      
      if(response.data.code.error) {
        Alert.alert('Не удалось отправить код', 'Почта не найдена');
        return;
      }
      setCorrectCode(response.data.code);
      setIsSend(true);
    } catch {
      Alert.alert('Не удалось отправить код', 'Неизвестная ошибка')
    } finally {
      SetIsSending(false);
    }
  }

  const verify = () => {
    if(correct_code != code) {
      Alert.alert('Неверный код!', 'Проверьте почту или отправьте код повторно');
      return;
    }

    navigation.navigate('NewPassword', {email: email});
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.Text}>
            {"Восстановление пароля"}
          </Text>
          
          {!isSend && <TextInput
            placeholder="Почта"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputContainer}
          />}

          {isSend && <TextInput
            placeholder="Код восстановления"
            value={code}
            keyboardType='numeric'
            maxLength={4}
            onChangeText={text => setCode(text)}
            style={styles.inputContainer}
          />}
        </View>
        <View style={styles.formContainer}>
          {!isSend 
          ?
            <Button
              title="Отправить код"
              buttonStyle={styles.button}
              onPress={sendLink}
              disabled={isSending}
            />
          :
            <Button
              title="Далее"
              buttonStyle={styles.button}
              onPress={verify}
            />
          }
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationForm;