import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { primaryColor } from '../../constants/Colors'
import { MaterialIcons } from '@expo/vector-icons'; 

export default function CustomButton({IconName, ButtonName}: {IconName: any, ButtonName: string}) {
    return (
        <View style={styles.Container}>
          <View style={styles.IconBlock}>
            <MaterialIcons name={IconName} size={24} color='white'/>
          </View>
          <Text style={{fontSize: 24}}>{ButtonName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row', 
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        width: '95%', 
        height: 60, 
        borderColor: 'gray',
        borderWidth: 2, 
        borderRadius: 20,
        gap: 15,
    },
    IconBlock: {
        backgroundColor: primaryColor, 
        borderRadius: 10, 
        padding: 6
    }
})