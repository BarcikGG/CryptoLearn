import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'

import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import RegistrationForm from '../screens/Auth/RegistrationForm';
import AuthForm from '../screens/Auth/AuthForm';
import TradingScreen from '../screens/Trading/TradingScreen';
import NewsScreen from '../screens/News/NewsScreen';
import { primaryColor } from '../constants/Colors';
import CurrentNewsScreen from '../screens/News/CurrentNewsScreen';
import BalanceHistoryScreen from '../screens/Profile/Balance/BalanceHistoryScreen';
import CoursesScreen from '../screens/Profile/Courses/CoursesScreen';
import ValuesScreen from '../screens/Profile/Courses/ValuesScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import ChatScreen from '../screens/Profile/Chat/ChatScreen';
import AboutScreen from '../screens/Profile/Courses/AboutScreen';
import BuyScreen from '../screens/Profile/Courses/BuyScreen';
import CoinScreen from '../screens/Trading/CoinScreen';
import DepositScreen from '../screens/Profile/Balance/DepositScreen';
import AddCourseScreen from '../screens/Profile/Courses/AddCourseScreen';
import AddLessonScreen from '../screens/Lessons/AddLessonScreen';

export default function StackNavigator() {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
  
    const BottomTabs = () => {
      return (
        <Tab.Navigator
          initialRouteName='Профиль'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              var iconName;
    
              if (route.name === 'Новости') {
                iconName = focused ? 'newspaper-sharp' : 'newspaper-outline';
              } else if (route.name === 'Трейдинг') {
                iconName = focused ? 'podium' : 'podium-outline';
              } else if (route.name === 'Профиль') {
                iconName = focused ? 'ios-person-circle' : 'ios-person-circle-outline';
              }
    
              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: primaryColor,
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Новости" component={NewsScreen} />
          <Tab.Screen name="Трейдинг" component={TradingScreen} />
          <Tab.Screen name="Профиль" component={ProfileScreen} />
        </Tab.Navigator>
      );
    };
  
    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={AuthForm} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegistrationForm} options={{headerShown: false}}/>
            <Stack.Screen name="CurrentNews" component={CurrentNewsScreen} />
            <Stack.Screen name="CurrentCoin" component={CoinScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Balance history" component={BalanceHistoryScreen}/>
            <Stack.Screen name="Deposit" component={DepositScreen}/>
            <Stack.Screen name="Add course" component={AddCourseScreen} />
            <Stack.Screen name="Add lesson" component={AddLessonScreen} />

            <Stack.Screen name="Courses" component={CoursesScreen}/>
            <Stack.Screen name="AboutCourse" component={AboutScreen}/>
            <Stack.Screen name="Buy" component={BuyScreen}/>
            <Stack.Screen name="Values" component={ValuesScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
          </Stack.Navigator>
      </NavigationContainer>
    );
}
