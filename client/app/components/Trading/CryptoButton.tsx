import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import ShadowView from 'react-native-shadow-view';
import React from 'react'
import ICoin from '../../models/Response/ICoin';
import { AntDesign } from '@expo/vector-icons';

export default function CryptoButton({coin}: {coin: ICoin}) {
    const screenWidth = Dimensions.get('window').width;
    const percentColor = parseFloat(coin.changePercent24Hr) < 0 ? 'red' : 'green';
    const iconName = parseFloat(coin.changePercent24Hr) < 0 ? 'caretdown' : 'caretup';

    const formatNumber = (number: string) => {
        return parseFloat(number).toFixed(2);
      };
      
    const formatMarketCap = (marketCap: string) => {
        const abbreviations = ["", "K", "M", "B", "T"];
        let index = 0;

        let cap = parseFloat(marketCap);
        
        while (cap >= 1000 && index < abbreviations.length - 1) {
            cap /= 1000;
            index++;
        }
        
        return `${formatNumber(cap.toString())} ${abbreviations[index]}`;
    };

    return (
        <ShadowView style={[styles.shadowContainer, {width: screenWidth * 0.95}]}>   
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/2272/2272825.png'}} style={styles.image}/>
                    <View style={{marginLeft: 10, gap: 5}}>
                        <Text style={{fontSize: 18}}>{coin.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={styles.rank}>
                                <Text style={{fontSize: 14}}>{coin.rank}</Text>
                            </View>
                            <Text style={{fontSize: 16, color: 'gray'}}>{coin.symbol}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                <AntDesign name={iconName} size={12} color={percentColor} style={{marginTop: 2}}/>
                                <Text style={{fontSize: 14, color: percentColor}}>{coin.changePercent24Hr.slice(0, 5)}%</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'column', gap: 5}}>
                    <Text style={{ fontSize: 18, textAlign: 'right' }}>${formatNumber(coin.priceUsd)}</Text>
                    <Text style={{ fontSize: 16, color: 'gray', textAlign: 'right' }}>${formatMarketCap(coin.marketCapUsd)}</Text>
                </View>
            </View>
        </ShadowView>
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
        flexDirection: "row",
        width: '100%',
        height: 60,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    image: {
        width: 40,
        height: 40
    },
    rank: {
        width: 'auto',
        paddingHorizontal: 5,
        height: 20,
        backgroundColor: 'lightgray',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
})