import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { View, Text, Pressable, Image, Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import $api from "../../http";
import Loading from "../../components/elements/Loading";
import { useAuth } from "../../contexts/AuthContext";
import IUser from "../../models/IUser";
import { primaryColor } from "../../constants/Colors";
import CustomButton from "../../components/Profile/CustomButton";

export default function ProfileScreen({navigation}: any) {
  const { userId } = useAuth();
  const [ user, setUser ] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.username,
      headerRight: () => (
        <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingEnd: 20}}>
          <Ionicons onPress={() => handleLogout()} name="ios-exit-outline" size={24} color="black" />
        </View>
      ),
      headerLeft: () => (
        <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingStart: 20}}>
          <Ionicons onPress={() => navigation.navigate('EditProfile', {user: user})} name="create-outline" size={24} color="black" />
        </View>
      )
    }, [])
  });

  const fetchUser = async() => {
    try {
      const response = await $api.get(`/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error getting user:', error);
      Alert.alert('Error', 'Failed to get user information');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
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
    <View style={{ backgroundColor: 'white' }}>
      <ScrollView
          contentContainerStyle={styles.ScrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          >
        <View style={styles.UserInfo}>
          <Image 
            style={styles.Avatar} 
            source={{uri:user?.avatar || 'https://atg-prod-scalar.s3.amazonaws.com/studentpower/media/user%20avatar.png'}} />
          <View style={styles.UserInfoTextBlock}>
            <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 5 }}>{user?.fullname ? user?.fullname  : 'name surname'}</Text>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>{user?.email}</Text>
            {user?.isverified 
              ?  <View style={styles.VerifyBlock}>
                  <MaterialIcons name="verified" size={20} color="green"/>
                  <Text style={styles.textVerify}>Верифицирован</Text>
              </View>
              : <View style={styles.VerifyBlock}>
                  <MaterialIcons name="cancel" size={20} color="red"/>
                  <Text style={styles.textVerify}>Не верифицирован</Text>
              </View>
            } 
          </View>
        </View>
        
        <TouchableOpacity style={styles.Balance} onPress={() => navigation.navigate("Balance history", {balance: user?.balance})}>
            <Text style={[styles.text, {color: 'gray', marginBottom: 5}]}>Balance: </Text>
            <Text style={[styles.text, {fontWeight: '500', marginBottom: 0}]}>${user?.balance.toString()}</Text>
        </TouchableOpacity>

        <CustomButton IconName="attach-money" ButtonName="Уроки по криптовалюте"
                      navigation={navigation} to={"Courses"} Type={"crypto"}/>
        <CustomButton IconName="waterfall-chart" ButtonName="Уроки по трейдингу"
                      navigation={navigation} to={"Courses"} Type={"trading"}/>
        <CustomButton IconName="menu-book" ButtonName="Все курсы"
                      navigation={navigation} to={"Courses"} Type={"all"}/>
        <CustomButton IconName="show-chart" ButtonName="Курсы валют"
                      navigation={navigation} to={"ExchangeCourse"} Type={"exchange"}/>

        <View style={styles.Bar}></View>

        <CustomButton IconName="chat-bubble" ButtonName="Чат с поддержкой"
                      navigation={navigation} to={"Chat"} Type={"chat"}/>
        <CustomButton IconName="settings" ButtonName="Настройки"
                      navigation={navigation} to={"Settings"} Type={"settings"}/>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ScrollContainer: {
    height: '100%',
    flexDirection: 'column', 
    alignItems: 'center', 
    paddingVertical: 10
  },
  UserInfo: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 20,
    paddingBottom: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: primaryColor
  },
  UserInfoTextBlock: {
    flexDirection: 'column'
  },
  Avatar: {
    height: 85, 
    width: 85, 
    resizeMode: 'cover', 
    borderRadius: 43
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10
  },
  VerifyBlock: {
    flexDirection: 'row', 
    gap: 5, 
    alignItems: 'center'
  },
  textVerify: {
    textAlignVertical: 'center', 
    fontSize: 16
  },
  Balance: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    width: '90%', 
    padding: 10,
    borderWidth: 2,
    borderColor: primaryColor,
    borderRadius: 20,
    marginBottom: 10
  },
  Bar: {
    backgroundColor: 'gray',
    width: '100%',
    height: 1,
    marginTop: 20
  }
})