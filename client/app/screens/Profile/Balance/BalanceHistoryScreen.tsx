import { Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import $api from '../../../http';
import IBalanceHistory from '../../../models/IBalanceHistory';
import { primaryColor } from '../../../constants/Colors';
import Loading from '../../../components/elements/Loading';
import BalanceHistory from '../../../components/Profile/BalanceHistory';

export default function BalanceHistoryScreen({navigation}: any) {
    const { userId } = useAuth();
    const [balanceHistory, setBalanceHistory] = useState<IBalanceHistory[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async() => {
        try {
          const response = await $api.get(`/balance/${userId}`);
          setBalanceHistory(response.data);
        } catch (error) {
          console.error('Error getting hisory:', error);
          Alert.alert('Error', 'Failed to get balance history');
        } finally {
          setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
      }, [refreshing]);
    
    const onRefresh = async () => {
        setRefreshing(true);
        fetchHistory();
    };

    if(isLoading) {
        return (
            <Loading/>
        );
    }
    
    return (
        <View style={{ width: '100%'}}>
            {balanceHistory ? 
                <FlatList
                data={balanceHistory?.map((trans, index) => ({ key: index, trans: trans }))}
                keyExtractor={(item) => item.key.toString()}
                renderItem={({ item }) => <BalanceHistory navigation={navigation} transcation={item.trans}/>}
                contentContainerStyle={{ padding: 10, alignContent: 'center' }}
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
                    marginTop: 10}}>Истории нет</Text>
                <TouchableOpacity
                    onPress={() => fetchHistory()}
                    style={styles.pressable}>
                    <Text style={styles.btnText}>Обновить</Text>
                </TouchableOpacity>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 20,
        flexDirection: 'column'
    },
    pressable: {
        backgroundColor: primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: 'auto',
        height: 'auto',
        borderRadius: 25
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
    }
})