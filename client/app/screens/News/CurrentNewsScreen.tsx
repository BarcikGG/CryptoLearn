import { StyleSheet, Text, Image, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useLayoutEffect, useState } from 'react';
import INews from '../../models/Response/INews';

export default function CurrentNewsScreen ({navigation, route}: any) {
  const { news } = route.params as { news: INews };
  const date = news?.publishedAt ? new Date(news.publishedAt) : null;
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: formattedDate,
      headerLeft: () => (
        <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingEnd: 10}}>
          <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="black" />
        </View>
      )
    }, [])
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{news?.title}</Text>
      <Image source={{ uri: news?.urlToImage }} style={styles.img} />
      <Text style={styles.content}>{news?.description?.toString()}</Text>
      <Text style={styles.author}>Автор: {news?.author}</Text>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    marginBottom: 10
  },
  title: {
    padding: 10,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
  },
  content: {
    padding: 10,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'justify',
  },
  author: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
  },
  img: {
    width: '100%',
    aspectRatio: 1
  },
});
