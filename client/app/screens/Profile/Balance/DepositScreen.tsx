import { Alert, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import $api from '../../../http';
import { primaryColor } from '../../../constants/Colors';
import Loading from '../../../components/elements/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DepositScreen({navigation, route}: any) {
    const [promo, setPromo] = useState<string>('');
    const { balance } = route.params;
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: '',
        })
    });

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleDeposit = async () => {
        if(promo) {
            $api.post('/deposit', {userId: userId, balance: balance, promo: promo})
            .then(response => {
                if(response.data.error) {
                    Alert.alert(
                    'Ошибка пополнения',
                    `${response.data.message}`)
                } else {
                    AsyncStorage.setItem("userBalance", response.data.toString());
                    navigation.replace("Main");
                }
            })
            .catch(error => {
                Alert.alert(
                'Ошибка пополнения',
                `${error.response.data.message}`
            );
            });
        }
    }

    if(isLoading) {
        return (
            <Loading/>
        );
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: 'white', 
                    alignItems: 'center',
                    paddingTop: 30}}>   
                <TextInput
                            placeholder="промокод"
                            value={promo}
                            onChangeText={text => setPromo(text)}
                            style={[styles.inputContainer]}
                            />
                <Pressable onPress={handleDeposit} style={styles.pressable}>
                    <Text style={{color: 'white', fontSize: 22, textAlign: 'center'}}>применить</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    pressable: {
        backgroundColor: primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '85%',
        height: 'auto',
        borderRadius: 25
    },
    inputContainer: {
        fontSize: 20,
        marginBottom: 20,
        paddingStart: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 15,
        height: 45,
        width: '85%'
    },
    input: {
        borderRadius: 15,
        fontSize: 20,
        paddingStart: 20,
        backgroundColor: 'white',
        height: 45,
        width: '100%',
        borderColor: 'gray',
        borderBottomWidth: 1,
    }
})