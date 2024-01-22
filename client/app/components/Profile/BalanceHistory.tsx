import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { primaryColor } from '../../constants/Colors'
import IBalanceHistory from '../../models/IBalanceHistory'

export default function BalanceHistory({navigation, transcation}: {navigation: any, transcation: IBalanceHistory}) {
    //debit - spisanie
    //credit - popolnenie

    return (
        <View style={styles.Balance}>
            <Text style={[styles.text, {color: 'gray', marginBottom: 5}]}>{transcation.operation_type}</Text>
            <Text style={[styles.text, {fontWeight: '500', marginBottom: 0}]}>{transcation.description}</Text>
            <Text style={[styles.text, {fontWeight: '400', marginBottom: 0}]}>{transcation.amount}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    Balance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        width: '100%', 
        marginTop: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: primaryColor,
        borderRadius: 20,
    },
})