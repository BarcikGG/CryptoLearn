import { useEffect, useState } from "react";
import { View, FlatList, Text, RefreshControl, Alert, StyleSheet, TouchableOpacity } from "react-native";
import Loading from "../../components/elements/Loading";
import axios from "axios";
import INews from "../../models/Response/INews";
import News from "../../components/News";
import { primaryColor } from "../../constants/Colors";

export default function NewsScreen ({navigation}: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<INews[]>();
  
  //old c5703e2bb836463f9d54165908fd9a6d
  //new 7ae77478644f4a489c2f9be9b196e7a3
  //another b4e83102c5f4471ca03b4d20a316eee7
  const apiKey = 'b4e83102c5f4471ca03b4d20a316eee7';
  const apiUrl = 'https://newsapi.org/v2/everything';
  const query = 'crypto';

  useEffect(() => {
    fetchNews();
  }, [refreshing]);

  const fetchNews = async() => {
    axios.get(apiUrl, {
      params: {
        q: query,
        language: 'ru',
        apiKey: apiKey,
        page: 1,
        limit: 150
      },
    })
      .then(response => {
        setNews(response.data.articles);
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Ошибка при получении новостей:', error.message);
        if(error.response.status == 429) Alert.alert('Ошибка сервера', 'Привышен лимит запросов!');
        else Alert.alert('Непредвиденная ошибка!', 'Уже чиним 🧑‍🔧');
        setIsLoading(false);
      })
  }

  const onRefresh = () => {
    setRefreshing(true);
  };

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <View style={{backgroundColor: 'white'}}>
      {news ? 
          <FlatList
          data={news?.map((news, index) => ({ key: index, news: news }))}
          keyExtractor={(item) => item.key.toString()}
          renderItem={({ item }) => <News news={item.news} navigation={navigation} />}
          contentContainerStyle={{ padding: 10, alignItems: 'center', gap: 20 }}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        : 
        <View style={styles.container}>
          <Text style={{ 
            textAlign: 'center', 
            fontSize: 20, 
            marginTop: 10}}>Новостей нет</Text>
          <TouchableOpacity
            onPress={() => fetchNews()}
            style={styles.pressable}>
            <Text style={styles.btnText}>Обновить</Text>
          </TouchableOpacity>
        </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    flexDirection: 'column'
  },
  pressable: {
    backgroundColor: primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 'auto',
    height: 'auto',
    borderRadius: 25
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500'
  }
});