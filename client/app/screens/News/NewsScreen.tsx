import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import Loading from "../../components/elements/Loading";
import $api from "../../http";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";

export default function NewsScreen ({navigation}: any) {
  const socket = useSocket();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


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
      <Text>news</Text>
    </View>
    // <FlatList
    //   data={friendsChat}
    //   keyExtractor={(item, index) => index.toString()}
    //   renderItem={({ item, index }) => <UserChat key={index} navigation={navigation} item={item} />}
    //   contentContainerStyle={{ padding: 10 }}
    //   showsVerticalScrollIndicator={true}
    //   refreshControl={
    //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    //   }
    // />
  );
}