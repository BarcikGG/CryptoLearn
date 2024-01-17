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

export default function StackNavigator() {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
  
    const BottomTabs = () => {
      return (
        <Tab.Navigator
          initialRouteName='News'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              var iconName;
    
              if (route.name === 'News') {
                iconName = focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline';
              } else if (route.name === 'Trading') {
                iconName = focused ? 'ios-map' : 'ios-map-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'ios-person-circle' : 'ios-person-circle-outline';
              }
    
              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'green',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="News" component={NewsScreen} />
          <Tab.Screen name="Trading" component={TradingScreen} options={{headerShown: false}}/>
          <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
      );
    };
  
    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={AuthForm} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegistrationForm} options={{headerShown: false}}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
          </Stack.Navigator>
      </NavigationContainer>
    );
}
