import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { primaryColor } from '../../constants/Colors'
import { Feather } from '@expo/vector-icons';
import IBalanceHistory from '../../models/IBalanceHistory'

export default function BalanceHistory({transcation}: {transcation: IBalanceHistory}) {
    const isDebit = transcation.operation_type == 'debit';
    const iconName = isDebit? 'arrow-up' : 'arrow-down';
    const date = new Date(transcation.transaction_date);
    let formattedDate = '';

    if(date) 
    {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    return (
        <View style={styles.Balance}>
            <View style={[styles.icon, isDebit? {backgroundColor: 'red'} : {backgroundColor: 'green'}]}>
                <Feather name={iconName} size={24} color="white" />
            </View>
            <View>
                <Text style={[styles.text, {fontWeight: '500', marginBottom: 0}]}>{transcation.description}</Text>
                <Text style={[styles.text, {fontWeight: '300', marginBottom: 0, fontSize: 16}]}>{formattedDate}</Text>
            </View>
            <Text style={[styles.text, {fontWeight: '400', marginBottom: 0}, isDebit? {color: 'red'} : {color: 'green'}]}>{isDebit ? '-' : '+'}${transcation.amount}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 10
    },
    Balance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%', 
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },
})