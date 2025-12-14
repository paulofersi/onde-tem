import { ApolloProvider } from '@apollo/client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { GluestackProvider } from '@/components/ui/gluestack-provider';
import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { apolloClient } from '@/lib/apollo-client';
import { store } from '@/store/store';

import { NotificationInitializer } from '@/components/NotificationInitializer';
import { UpdatesInitializer } from '@/components/UpdatesInitializer';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { theme } = useTheme();

  return (
    
    <GluestackUIProvider mode="dark">
      <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="supermarket-details" 
          options={{ 
            presentation: 'card',
            title: 'Detalhes do Supermercado',
            headerShown: true,
            headerStyle: {
              backgroundColor: Colors[theme].background,
            },
            headerTintColor: Colors[theme].text,
            headerTitleStyle: {
              color: Colors[theme].text,
            },
          }} 
        />
        <Stack.Screen 
          name="product-form" 
          options={{ 
            presentation: 'card',
            title: 'Produto',
            headerShown: true,
            headerStyle: {
              backgroundColor: Colors[theme].background,
            },
            headerTintColor: Colors[theme].text,
            headerTitleStyle: {
              color: Colors[theme].text,
            },
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
    </GluestackUIProvider>
  
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider>
            <GluestackProvider>
              <AuthProvider>
                <UpdatesInitializer />
                <NotificationInitializer />
                <AppContent />
              </AuthProvider>
            </GluestackProvider>
          </ThemeProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
