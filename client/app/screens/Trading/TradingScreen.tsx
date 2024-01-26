import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import CryptoButton from '../../components/Trading/CryptoButton';
import Loading from '../../components/elements/Loading';
import ICoin from '../../models/Response/ICoin';

const TradingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ coins, setCoins ] = useState<ICoin[]>([]);

  const fetchCoins = async() => {
    try {
      fetch("https://api.coincap.io/v2/assets", {
        method: 'GET',
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(result => setCoins(result.data))
        .catch(error => console.log('error', error));
    } catch (error) {
        console.error('Error getting coins:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить монеты');
    } finally {
        setIsLoading(false);
        setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchCoins();
  }, [refreshing]);

  const onRefresh = () => {
      setRefreshing(true);
  };

  if (isLoading) {
      return (
        <Loading/>
      );
  }

  return (
      <FlatList
        data={coins.map((coin, index) => ({ key: index, coin: coin }))}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) =>
            <CryptoButton coin={item.coin} />
        }
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
      />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    gap: 10
  }
});

export default TradingScreen;