import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Loading from '../../../components/elements/Loading';
import SelectDropdown from 'react-native-select-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { primaryColor } from '../../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function ValuesScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<Array<{ currency: string; rate: string }>>([]);
  const [to, setTo] = useState('RUB');
  const [from, setFrom] = useState('USD');
  const [valuesNames, setValuesNames] = useState<Array<string>>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Курсы валют',
    })
  });

  useEffect(() => {
    fetchCurrencyRates();
  }, [refreshing]);

  const fetchCurrencyRates = async () => {
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const result = await response.json();

      if (result && result.rates) {
        setData(Object.entries(result.rates).map(([currency, rate]) => ({ currency, rate: parseFloat(rate).toFixed(2) })));
        setValuesNames(Object.entries(result.rates).map(([currency]) => (currency)));
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  function swap() {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setRefreshing(true);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dropContainer}>
        <SelectDropdown
          buttonStyle={styles.dropBtn}
          dropdownStyle={styles.drop}
          data={valuesNames}
          defaultValue={'USD'}
          onSelect={(selectedItem) => {
            setFrom(selectedItem);
            setRefreshing(true);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          defaultButtonText='From'
          search={true}
          searchPlaceHolder='Валюта...'
        />
        <Text style={{alignSelf: 'center', fontSize: 24}}>=</Text>
        <SelectDropdown
          buttonStyle={styles.dropBtn}
          dropdownStyle={styles.drop}
          data={valuesNames}
          defaultValue={'RUB'}
          onSelect={(selectedItem) => {
            setTo(selectedItem);
            setRefreshing(true);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          defaultButtonText='To'
          search={true}
          searchPlaceHolder='Валюта...'
        />
      </View>
      <FlatList
        data={data.filter(item => item.currency === to)}
        keyExtractor={(item) => item.currency}
        renderItem={({ item }) => (
          <View>
            <View style={styles.itemContainer}>
              <Text style={styles.currency}>1 {from} = </Text>
              <Text style={styles.rate}>{item.rate}</Text>
              <Text style={styles.currency}> {item.currency}</Text>
            </View>

            <Pressable onPress={() => swap()} style={styles.swap}>
                <Ionicons name="swap-horizontal-outline" size={20} color={primaryColor} />
                <Text style={{fontSize: 18, marginBottom: 5, color: primaryColor}}>swap</Text>
            </Pressable>
          </View>
        )}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'column'
  },
  drop: {
    marginTop: 5,
    borderRadius: 15
  },
  dropBtn: {
    backgroundColor: 'lightgray', 
    borderRadius: 15,
    width: '46%'
  },
  dropContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    padding: 10,
    gap: 10
  },
  container: {
    marginTop: 10,
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
    gap: 10
  },
  swap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 20,
    flexDirection: 'row'
  },
  itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  currency: {
      fontSize: 16,
  },
  rate: {
      fontSize: 16,
      fontWeight: 'bold',
  },
});
