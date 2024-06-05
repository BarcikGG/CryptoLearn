import { useEffect, useRef, useState } from "react";
import { View, FlatList, Text, RefreshControl, Alert, StyleSheet, TouchableOpacity, TextInput, Animated } from "react-native";
import Loading from "../../components/elements/Loading";
import axios from "axios";
import INews from "../../models/Response/INews";
import News from "../../components/News";
import { primaryColor } from "../../constants/Colors";
import SearchBar from "../../components/SearchBar";

export default function NewsScreen ({navigation}: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<INews[]>();
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const searchOpacity = useRef(new Animated.Value(1)).current;
  const prevScrollY = useRef(0);
  
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

  const filteredNews = news?.filter(news =>
    news?.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > prevScrollY.current ? 'down' : 'up';

    if (direction === 'down' && currentOffset > 0) {
      if (showSearch) {
        Animated.timing(searchOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowSearch(false));
      }
    } else if (direction === 'up' || currentOffset === 0) {
      if (!showSearch) {
        setShowSearch(true);
        Animated.timing(searchOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }

    prevScrollY.current = currentOffset;
  };

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <View style={{backgroundColor: 'white', paddingBottom: 90, minHeight: '100%'}}>
      <SearchBar searchOpacity={searchOpacity} searchText={searchText} setSearchText={setSearchText} />
      {news ? 
          <FlatList
          data={filteredNews?.map((news, index) => ({ key: index, news: news }))}
          keyExtractor={(item) => item.key.toString()}
          renderItem={({ item }) => <News news={item.news} navigation={navigation} />}
          contentContainerStyle={{ padding: 10, alignItems: 'center', gap: 20, paddingTop: 60 }}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
  },
  searchInput: {
    height: 40,
    width: '90%',
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'center'
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1
  },
});