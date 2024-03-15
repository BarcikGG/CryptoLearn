import { Alert, Dimensions, FlatList, RefreshControl, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import $api from '../../../http';
import { useAuth } from '../../../contexts/AuthContext';
import Loading from '../../../components/elements/Loading';
import ShadowView from 'react-native-shadow-view';

interface Coin {
    key: number;
    coin: {
        coinname: string;
        symbol: string;
        amount: number;
        imageurl: string;
    };
  }

export default function ActivesScreen() {
    const screenWidth = Dimensions.get('window').width;
    const { userId } = useAuth();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [coins, setCoins] = useState([]);
    
    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: 'Мои монеты',
        })
    });

    useEffect(() => {
        fetchCoins();
    }, [refreshing])

    const fetchCoins = async() => {
        try {
            const response = await $api.get(`/coins/${userId}`);
            setCoins(response.data);
        } catch (error) {
            console.error('Error getting coins:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить монеты');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
    };

    if (isLoading) {
        return (
            <Loading/>
        );
    }

    return (
        <View style={{backgroundColor: 'white', width: '100%'}}>
            {coins ? 
                <FlatList
                data={coins.filter((item: Coin) => item.amount > 0).map((coin, index) => ({ key: index, coin: coin }))}
                keyExtractor={(item) => item.key.toString()}
                renderItem={({ item }: {item: Coin}) => {
                    return (
                        <ShadowView style={[styles.shadowContainer, {width: screenWidth * 0.90}]}>
                            <View style={styles.coinContainer}>
                                <View style={styles.subContainer}>
                                    <Image source={{uri: item.coin.imageurl}} style={{ width: 40, height: 40 }}/>
                                    <Text style={{fontSize: 20}}>{item.coin.symbol.toUpperCase()}</Text>
                                </View>

                                <View style={styles.subContainer}>
                                    <Text style={{color: 'gray'}}>
                                        {Number(item.coin.amount).toFixed(4).replace(/\.?0+$/, '')} шт.
                                    </Text>
                                </View>
                            </View>
                        </ShadowView>
                    );
                }}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={true}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            :
                <View style={styles.container}>
                    <Text style={{ 
                        textAlign: 'center', 
                        fontSize: 20, 
                        marginTop: 10}}>
                            Пора купить первую криптовалюту!
                    </Text>
                </View>
            }
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
        width: '100%',
        height: 'auto',
        minHeight: '100%',
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingBottom: 50,
        gap: 16
    },
    coinContainer: {
        paddingHorizontal: 10,
        width: '100%',
        height: 65,
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})