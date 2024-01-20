import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TradingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Trading</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  roundButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TradingScreen;
