import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  
  useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: 'Настройки',
      })
  });


  return (
    <View>
      <Text>Settings</Text>
    </View>
  )
}

const styles = StyleSheet.create({})