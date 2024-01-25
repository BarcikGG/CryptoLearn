import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { primaryColor } from '../../constants/Colors'
import { MaterialIcons } from '@expo/vector-icons'; 

export default function CustomButton({IconName, ButtonName, navigation, to, Type}: {IconName: any, ButtonName: string, navigation: any, to: string, Type: string}) {
    return (
        <TouchableOpacity style={styles.Container}
            onPress={() => navigation.navigate(to, {type: Type})}>
          <View style={styles.IconBlock}>
            <MaterialIcons name={IconName} size={20} color='white'/>
          </View>
          <Text style={{fontSize: 20}}>{ButtonName}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    shadowContainer: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    Container: {
        flexDirection: 'row', 
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '95%', 
        height: 60,
        gap: 15,
    },
    IconBlock: {
        backgroundColor: primaryColor, 
        borderRadius: 10, 
        padding: 6
    }
})