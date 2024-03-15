import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function ActivesScreen() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    
    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: 'Мои монеты',
        })
    });

    return (
        <View>
            <Text>Портфель</Text>
        </View>
    )
}

const styles = StyleSheet.create({})