import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons'; 
import { View, Text, Pressable, Image, Linking, Alert, RefreshControl, ScrollView} from "react-native";
import $api from "../../http";
import Loading from "../../components/elements/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native";

export default function ProfileScreen({navigation}: any) {
  const { userId } = useAuth();
  //const [ user, setUser ] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerRight: () => (
        <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingEnd: 10}}>
          <Ionicons onPress={() => handleLogout()} name="ios-exit-outline" size={24} color="black" />
        </View>
      ),
      headerLeft: () => (
        <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingStart: 10}}>
          {/* <Feather onPress={() => navigation.navigate('EditProfile', {user: user})} name="edit" size={22} color="black" /> */}
        </View>
      )
    }, [])
  });
  
  const fetchUser = async () => {
    try {
      const response = await $api.get(`/user/${userId}`);
      //setUser(response.data);
    } catch (error) {
      console.error('Error getting user:', error);
      Alert.alert('Error', 'Failed to get user information');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('authToken');
  
      await $api.post('/logout', { refreshToken });
  
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userID');

      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [refreshing]);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchUser();
  };

  if(isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Profile</Text>
      </ScrollView>
    </SafeAreaView>
  );
}