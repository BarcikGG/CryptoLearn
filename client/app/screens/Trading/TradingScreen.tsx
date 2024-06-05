import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Alert, FlatList, RefreshControl, TextInput, View, Animated } from 'react-native';
import CryptoButton from '../../components/Trading/CryptoButton';
import Loading from '../../components/elements/Loading';
import ICoin from '../../models/Response/ICoin';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/SearchBar';

const TradingScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ coins, setCoins ] = useState<ICoin[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSearch, setShowSearch] = useState(true);
  const searchOpacity = useRef(new Animated.Value(1)).current;
  const prevScrollY = useRef(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingEnd: 20}}>
          <Ionicons onPress={() => handleSortOrderChange()} name="swap-vertical" size={24} color="black" />
        </View>
      ),
    })
  });

  const fetchCoins = async() => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd', {
            headers: { 
              'x-cg-demo-api-key': 'CG-rJcCTbMBPdFRgPNdC172kjNt'
            }
      });

      setCoins(response.data);
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

  const handleSortOrderChange = () => {
    if (sortOrder === 'asc') setSortOrder("desc");
    else setSortOrder("asc")

    filteredCoins.sort((a: any, b: any) => {
      if (sortOrder === 'asc') {
        return a.current_price - b.current_price;
      } else {
        return b.current_price - a.current_price;
      }
    });

    setCoins(filteredCoins);
  };

  const filteredCoins = coins.filter(coin =>
    coin?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > prevScrollY.current ? 'down' : 'up';

    if (direction === 'down' && currentOffset > 0) {
      if (showSearch) {
        Animated.timing(searchOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowSearch(false));
      }
    } else if (direction === 'up' || currentOffset === 0) {
      if (!showSearch) {
        setShowSearch(true);
        Animated.timing(searchOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }

    prevScrollY.current = currentOffset;
  };

  const onRefresh = () => {
      setRefreshing(true);
  };

  if (isLoading) {
      return (
        <Loading/>
      );
  }

  return (
      <View style={{backgroundColor: 'white', minHeight: '100%', paddingBottom: 90}}>
        <SearchBar searchOpacity={searchOpacity} searchText={searchText} setSearchText={setSearchText} />
        <FlatList
          data={filteredCoins.map((coin, index) => ({ key: index, coin: coin }))}
          keyExtractor={(item) => item.key.toString()}
          renderItem={({ item }) =>
              <CryptoButton coin={item.coin} />
          }
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={true}
          refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    paddingTop: 60
  },
  searchInput: {
    height: 40,
    width: '95%',
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'center'
  },
});

export default TradingScreen;