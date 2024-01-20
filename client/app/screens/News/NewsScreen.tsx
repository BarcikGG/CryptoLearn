import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import Loading from "../../components/elements/Loading";
import $api from "../../http";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import axios from "axios";
import INews from "../../models/Response/INews";
import News from "../../components/News";

export default function NewsScreen ({navigation}: any) {
  const socket = useSocket();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<INews[]>();
  
  //old c5703e2bb836463f9d54165908fd9a6d
  //new 7ae77478644f4a489c2f9be9b196e7a3
  const apiKey = '7ae77478644f4a489c2f9be9b196e7a3';
  const apiUrl = 'https://newsapi.org/v2/everything';
  const query = 'crypto';


  axios.get(apiUrl, {
    params: {
      q: query,
      apiKey: apiKey,
      page: 1
    },
  })
    .then(response => {
      setNews(response.data.articles);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Ошибка при получении новостей:', error.message);
      if(error.response.status == 429) Alert.alert('Ошибка сервера', 'Привышен лимит запросов!');
      else Alert.alert('Непредвиденная ошибка!', 'Уже чиним 🧑‍🔧');
      setIsLoading(false);
    })

  const onRefresh = () => {
    setRefreshing(true);
  };

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <View>
      <FlatList
      data={news}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => <News key={index} news={item} />}
      contentContainerStyle={{ padding: 10, alignItems: 'center' }}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
    </View>
  );
}