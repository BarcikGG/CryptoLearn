import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import ShadowView from 'react-native-shadow-view';
import React from 'react'
import ICoin from '../../models/Response/ICoin';
import { AntDesign } from '@expo/vector-icons';

export default function CryptoButton({coin}: {coin: ICoin}) {
    const screenWidth = Dimensions.get('window').width;
    const percentColor = coin.values.USD.percentChange24h < 0 ? 'red' : 'green';
    const iconName = coin.values.USD.percentChange24h < 0 ? 'caretdown' : 'caretup';

    const formatNumber = (number: number) => {
        return number.toFixed(2);
      };
      
    const formatMarketCap = (marketCap: number) => {
        const abbreviations = ["", "K", "M", "B", "T"];
        let index = 0;

        while (marketCap >= 1000 && index < abbreviations.length - 1) {
            marketCap /= 1000;
            index++;
        }
        
        return `${formatNumber(marketCap)} ${abbreviations[index]}`;
    };

    return (
        <ShadowView style={[styles.shadowContainer, {width: screenWidth * 0.95}]}>   
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: `https://api.cryptorank.io/static/img/coins/60x60.bitcoin1524754012028.png`}} style={styles.image}/>
                    <View style={{marginLeft: 10, gap: 5}}>
                        <Text style={{fontSize: 18}}>{coin.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={styles.rank}>
                                <Text style={{fontSize: 14}}>{coin.rank}</Text>
                            </View>
                            <Text style={{fontSize: 16, color: 'gray'}}>{coin.symbol}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                <AntDesign name={iconName} size={12} color={percentColor} style={{marginTop: 2}}/>
                                <Text style={{fontSize: 14, color: percentColor}}>{coin.values.USD.percentChange24h.toFixed(2)}%</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'column', gap: 5}}>
                    <Text style={{ fontSize: 18, textAlign: 'right' }}>${formatNumber(coin.values.USD.price)}</Text>
                    <Text style={{ fontSize: 16, color: 'gray', textAlign: 'right' }}>Mcap: ${formatMarketCap(coin.values.USD.marketCap)}</Text>
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