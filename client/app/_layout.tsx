import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import Login from './(auth)/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import decodeToken from './utils/decodeToken';
import axios from 'axios';
import { BASE_URL } from './utils/config';
import { AuthProvider } from './contexts/AuthContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const checkAuthentication = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('authToken');
      if (refreshToken) {
        const token = await AsyncStorage.getItem('authToken');
        const decodedToken = decodeToken(token);
        const userId = decodedToken.userId;
        
        const response = await axios.post(`${BASE_URL}/refresh`, { refreshToken });
        AsyncStorage.setItem('token', response.data.userData.accessToken);
        AsyncStorage.setItem('userID', userId);

        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Authentication error:', error);
    }
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      checkAuthentication();

      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav  isAuthenticated={isAuthenticated}/>;
}

function RootLayoutNav({isAuthenticated}: {isAuthenticated: boolean}) {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(tabs)/index">
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        )}
      </Stack>
    </ThemeProvider>
  </AuthProvider>
  );
}