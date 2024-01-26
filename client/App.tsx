import { StyleSheet } from 'react-native';
import { SocketProvider } from './app/contexts/SocketContext';
import { AuthProvider } from './app/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigator from './app/components/StackNavigator';
import { RoleProvider } from './app/contexts/RoleContext';

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <RoleProvider>
            <SocketProvider>
              <StackNavigator></StackNavigator>
            </SocketProvider>
          </RoleProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
