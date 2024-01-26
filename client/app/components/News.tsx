import { Pressable, StyleSheet, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import INews from '../models/Response/INews';
import ShadowView from 'react-native-shadow-view'

interface NewsProps {
  news: INews;
  navigation: any
}

const News: React.FC<NewsProps> = ({ news, navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <ShadowView style={[styles.shadowContainer, {width: screenWidth * 0.95}]}>
      <Pressable onPress={() => navigation.navigate("CurrentNews", {news: news})} style={styles.container}>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.author}>Автор: {news.author}</Text>
        <Image source={{ uri: news.urlToImage }} style={styles.img} />
      </Pressable>
    </ShadowView>
  );
};

export default News;

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    alignSelf: 'center',
    width: '95%',
    height: 'auto',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  title: {
    padding: 10,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
  },
  author: {
    paddingHorizontal: 10,
    fontSize: 16,
    marginTop: -5,
    fontWeight: '400',
    textAlign: 'left',
    marginBottom: 5
  },
  img: {
    width: '100%',
    aspectRatio: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});
