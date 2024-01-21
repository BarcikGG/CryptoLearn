import axios from 'axios';
import { BASE_URL } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const $api = axios.create({
  baseURL: BASE_URL
});

$api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    //console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
  }

  return config;
});

$api.interceptors.response.use(async (config) => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  const refreshToken = await AsyncStorage.getItem('authToken');
  
  if(error.response.status == 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try{
      const response = await axios.post(`${BASE_URL}/refresh`, { refreshToken });
      AsyncStorage.setItem('token', response.data.userData.accessToken);
      return $api.request(originalRequest);
    } catch(e) {
      console.log('No authorize');
    }
  }
  throw error;
});

export default $api;
