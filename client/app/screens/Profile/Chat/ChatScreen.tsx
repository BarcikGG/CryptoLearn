import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    
    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: 'Чат',
        })
    });

    return (
        <View>
            <Text>ChatScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({})