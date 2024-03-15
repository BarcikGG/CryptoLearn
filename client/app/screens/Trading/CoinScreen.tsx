import { Text, StyleSheet, View, ScrollView, Alert, Pressable, SafeAreaView, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import ICoin from '../../models/Response/ICoin'
import $api from '../../http';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { primaryColor } from '../../constants/Colors';

export default function CoinScreen({navigation, route}: any) {
    const { coin } = route.params as { coin: ICoin };
    const { userId } = useAuth();
    const [balance, setBalance] = useState<number>(0);
    const [amount, setAmount] = useState('');
    const [avalable, setAvalable] = useState<number>(0);
    const [isBuy, setIsBuy] = useState(true);
    //const [data, setData] = useState();
    const percentColor = coin.price_change_percentage_24h < 0 ? 'red' : 'green';

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: coin.symbol.toUpperCase() + '/USD'
        }, [])
    });

    useEffect(() => {
        getCrypto();
        getBalance();
    }, []);

    const getBalance = async() => {
        const balance = await AsyncStorage.getItem("userBalance");
        setBalance(Number(balance));
    }

    const getCrypto = async() => {
        try {
            const response = await $api.get(`/current-crypto/${userId}/${coin.id}`);
            setAvalable(response.data);
        } catch (error) {
            console.error('Error getting user`s coin:', error);
        }
    }

    // const fetchData= async() => {
    //     try {
    //         const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=7&interval=daily`, {
    //             headers: { 
    //             'x-cg-demo-api-key': 'CG-rJcCTbMBPdFRgPNdC172kjNt'
    //             }
    //         });

    //         if(response) setData(response.data);
    //     } catch (error) {
    //         console.error('Error getting coins:', error);
    //         Alert.alert('Ошибка', 'Не удалось график монеты');
    //     } finally {

    //     }
    // }

    const setMax = () => {
        if(isBuy) {
            const amount = (balance / coin.current_price).toFixed(4);
            setAmount(amount.toString());
        } else {
            setAmount(avalable.toString());
        }
    }

    const buyCrypto = () => {
        try {
            if (balance < (Number(amount) * coin.current_price)) {
              Alert.alert("Ошибка", "Недостаточно средств");
              return;
            }

            //fix then amount p.g 0.5 balance = NaN
            const newBalance = balance - (coin.current_price * Number(amount.replace(',', '.')));
            
            $api.post('/buy-crypto', {userId: userId, coin: coin.id, symbol: coin.symbol, amount: amount, image: coin.image, balance: newBalance.toFixed(2).toString()})
              .then(response => {
                  AsyncStorage.setItem("userBalance", newBalance.toString());
                  setBalance(newBalance);
                  setAmount('');
                  setAvalable(avalable + Number(amount));
                  Alert.alert(`${coin.symbol} успешно куплен!`,'Монета добавлена в ваш портфель');
              })
              .catch(error => {
                  Alert.alert(
                  'Ошибка покупки',
                  `${error.response.data.message}`
              );
              });
        } catch (error) {
            console.error("Ошибка при покупке монеты:", error);
        }
    }

    const sellCrypto = () => {
        try {
            if (avalable < Number(amount)) {
              Alert.alert("Ошибка", "Недостаточно монет");
              return;
            }

            const newBalance = balance + (coin.current_price * Number(amount.replace(',', '.')));
            
            $api.post('/sell-crypto', {userId: userId, coin: coin.id, amount: amount, balance: newBalance.toFixed(2).toString()})
              .then(response => {
                  AsyncStorage.setItem("userBalance", newBalance.toString());
                  setBalance(newBalance);
                  setAmount('');
                  setAvalable(avalable - Number(amount));
                  Alert.alert(`${coin.symbol} успешно продан!`,'Ваш баланс пополнен');
              })
              .catch(error => {
                  Alert.alert(
                  'Ошибка продажи',
                  `${error.response.data.message}`
              );
              });
        } catch (error) {
            console.error("Ошибка при продажи монеты:", error);
        }
    }

    const formattedDate = (dateString: string) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formatted = new Date(dateString).toLocaleDateString(undefined, options);
        return formatted;
    };

    const percentChange = coin.price_change_percentage_24h;
    const initialPrice = coin.current_price;
    const priceChange = coin.price_change_24h;

    return (
        <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
                <Pressable onPress={() => setIsBuy(true)} style={[styles.topBtn, {borderBottomWidth: isBuy ? 1 : 0}]}>
                    <Text style={styles.text}>покупка</Text>
                </Pressable>
                <Pressable onPress={() => setIsBuy(false)} style={[styles.topBtn, {borderBottomWidth: isBuy ? 0 : 1}]}>
                    <Text style={styles.text}>продажа</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={{color: 'gray', fontSize: 18}}>{formattedDate(coin.last_updated)}</Text>
                    <Text style={{fontSize: 30, marginVertical: 5}}>${initialPrice.toFixed(2).toLocaleString()}</Text>
                    <View style={{flexDirection: 'row', gap: 5}}>
                        <Text style={{fontSize: 14, color: percentColor}}>${priceChange.toFixed(2)}</Text>
                        <Text style={{fontSize: 14, color: percentColor}}>({percentChange.toFixed(2)}%)</Text>
                    </View>
                </View>
                
                {/* <ChartComponent data={data}/> */}
                
                <View style={[styles.subContainer, {gap: 8}]}>
                    <View style={{flexDirection: 'row', gap: 5}}>
                        <Text style={{color: 'gray', fontSize: 18}}>Макс. цена за 24ч:</Text>
                        <Text style={{color: 'green', fontSize: 18}}>${coin.high_24h.toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', gap: 5}}>
                        <Text style={{color: 'gray', fontSize: 18}}>Мин.   цена за 24ч:</Text>
                        <Text style={{color: 'red', fontSize: 18}}>${coin.low_24h.toFixed(2)}</Text>
                    </View>

                    <TextInput
                        placeholder='Количество монет'
                        value={amount}
                        keyboardType='numeric'
                        onChangeText={text => setAmount(text)}
                        style={styles.inputContainer}
                    />

                    <Pressable onPress={setMax} style={{alignSelf: 'flex-end'}}>
                        <Text style={{color: primaryColor, fontSize: 16}}>макс.</Text>
                    </Pressable>

                    {!isBuy && <Text style={{fontSize: 16}}>
                        Доступно к продаже: {avalable > 0 ? avalable.toString().replace(/\.?0+$/, '') : 0} шт.
                    </Text>}
                </View>
            </ScrollView>
            
            <View style={{flexDirection: 'column'}}>
                
                <View style={{flexDirection: 'row', marginBottom: 10, justifyContent: 'space-around'}}>
                    {isBuy 
                    ? <Pressable style={[styles.button, {backgroundColor: 'green'}]} onPress={buyCrypto}>
                        <Text style={styles.btnText}>Купить</Text>
                    </Pressable>
                    : <Pressable style={[styles.button, {backgroundColor: 'red'}]} onPress={sellCrypto}>
                        <Text style={styles.btnText}>Продать</Text>
                    </Pressable>}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        fontSize: 16,
        marginTop: 10,
        paddingStart: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        height: 35,
        width: '100%'
    },
    container: {
        width: '100%',
        height: 'auto',
        flexDirection: 'column',
        marginBottom: 10,
        backgroundColor: 'white'
    },
    subContainer: {
        marginTop: 15,
        alignSelf: 'center',
        width: '95%',
        height: 'auto',
        flexDirection: 'column'
    },
    button: {
        height: 50,
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    btnText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '600'
    },
    topBtn: {
        width: '50%',
        height: 30,
        alignContent: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 18
    }
})