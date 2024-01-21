import { Pressable, StyleSheet, Text, Image, Dimensions } from 'react-native';
import React, { PureComponent } from 'react';
import INews from '../models/Response/INews';

interface NewsProps {
  news: INews;
}

const News: React.FC<NewsProps> = ({ news }) => {
  return (
    <Pressable onPress={() => {}} style={styles.container}>
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.author}>Автор: {news.author}</Text>
      <Image source={{ uri: news.urlToImage }} style={styles.img} />
    </Pressable>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: 'auto',
    flexDirection: 'column',
    marginBottom: 15,
    borderWidth: 2,
    borderRadius: 20,
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
  },
  img: {
    width: '100%',
    aspectRatio: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
