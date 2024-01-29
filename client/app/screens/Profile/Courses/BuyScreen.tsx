import { StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { primaryColor } from '../../../constants/Colors';
import ShadowView from 'react-native-shadow-view'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BuyScreen({navigation, route}: any) {
    const { course } = route.params;
    const [balance, setBalance] = useState(0);
    const [canBuy, setCanBuy] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: '',
        })
    });

    useEffect(() =>{
        const getBalance = async () => {
            const UserBalance = await AsyncStorage.getItem("userBalance");
            setBalance(parseFloat(UserBalance));

            if(parseFloat(UserBalance) < course.price) setCanBuy(false);
            else setCanBuy(true);
        }

        getBalance();
    }, [])

    const buyCourse = async () => {
        try {
          if (isNaN(balance) || balance < course.price) {
            Alert.alert("Ошибка", "Недостаточно средств");
            return;
          }
      

          await navigation.replace("Courses", { type: "my" });
        } catch (error) {
          console.error("Ошибка при покупке курса:", error);
        }
    };      

    return (
        <View style={styles.container}>
                <View style={{width: '100%'}}>
                    <ShadowView style={styles.shadowContainer}>
                        <View style={styles.courseCont}>
                            <Image source={{uri: course.avatar}} style={styles.img}/>
                            <Text style={styles.title}>{course.title}</Text>
                            <Text style={styles.title}>${course.price}</Text>
                        </View>
                    </ShadowView>

                    <Text style={{paddingLeft: 20, marginTop: 40, fontSize: 20, fontWeight: '500'}}>Баланс после покупки:</Text>
                    <View style={{width: '100%', marginTop: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[styles.title, {fontSize: 24}]}>${balance.toString()}</Text>
                        <AntDesign name="arrowright" size={24} color="black" style={{marginHorizontal: 5}}/>
                        <Text style={[styles.title, {fontSize: 24, color: canBuy ? 'green' : 'red'}]}>${(balance-course.price).toString()}</Text>
                    </View>
                </View>

                <View style={{marginBottom: 30, width: '100%'}}>
                    <Pressable style={[styles.btn, {backgroundColor: canBuy ? primaryColor : 'lightgray'}]} onPress={buyCourse}>
                        <Text style={styles.btnText}>{canBuy ? 'Купить' : 'Недостаточно средств'}</Text>
                    </Pressable>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowContainer: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    container: {
        justifyContent: 'space-between',
        paddingVertical: 20,
        backgroundColor: 'white', 
        width: '100%', 
        height: '100%',
    },
    courseCont: {
        borderRadius: 10,
        width: '95%', 
        height: 80,
        flexDirection: 'row', 
        alignItems: 'center', 
        alignSelf: 'center',
        justifyContent: 'space-between', 
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    img: {
        width: 50,
        height: 50,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    btn: {
        minWidth: '70%',
        width: 'auto',
        paddingHorizontal: 20,
        flexDirection: 'column',
        height: 60,
        alignSelf: 'center',
        borderRadius: 20,
        justifyContent: 'center'
    },
    btnText: {
        color: 'white', 
        fontSize: 24,
        fontWeight: '600', 
        textAlign: 'center'
    }
})