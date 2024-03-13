import { Text, StyleSheet, View, ScrollView, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import ICoin from '../../models/Response/ICoin'
import axios from 'axios';
import ChartComponent from '../../components/Trading/ChartComponent';

export default function CoinScreen({navigation, route}: any) {
    const { coin } = route.params as { coin: ICoin };
    const [data, setData] = useState();
    const percentColor = coin.price_change_percentage_24h < 0 ? 'red' : 'green';

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: coin.symbol + '/usd'
        }, [])
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData= async() => {
        const from = 1710306000;
        const to = 1710307830;
        try {
            // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`, {
            //     headers: { 
            //     'x-cg-demo-api-key': 'CG-rJcCTbMBPdFRgPNdC172kjNt'
            //     }
            // });

            // console.log(response.data);
            // if(response) setData(response.data);
        } catch (error) {
            console.error('Error getting coins:', error);
            Alert.alert('Ошибка', 'Не удалось график монеты');
        } finally {

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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
})