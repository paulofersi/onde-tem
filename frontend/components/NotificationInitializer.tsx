import { useAuth } from '@/context/AuthContext';
import { UPDATE_PUSH_TOKEN } from '@/graphql/mutations';
import { useNotifications } from '@/hooks/useNotifications';
import { apolloClient } from '@/lib/apollo-client';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function NotificationInitializer() {
  const { register, token, error, hasPermission, lastNotificationResponse } = useNotifications();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    register();
  }, []);

  useEffect(() => {
    const sendTokenToBackend = async () => {
      if (token && isAuthenticated) {
        try {
          await apolloClient.mutate({
            mutation: UPDATE_PUSH_TOKEN,
            variables: { pushToken: token },
          });
        } catch (err: any) {
          // Ignore errors
        }
      }
    };

    sendTokenToBackend();
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (lastNotificationResponse) {
      const data = lastNotificationResponse.notification.request.content.data;
      
      if (data?.type === 'NEW_PRODUCT' && data?.supermarketId) {
        const supermarketId = String(data.supermarketId);
        if (supermarketId) {
          router.push({
            pathname: '/supermarket-details',
            params: {
              id: supermarketId,
            } as { id: string },
          });
        }
      }
    }
  }, [lastNotificationResponse, router]);

  useEffect(() => {
    // Só logar erros reais, não casos esperados (emulador, permissão negada)
    if (error) {
      console.warn('Erro ao registrar notificações:', error);
    }
  }, [error]);

  // Este componente não renderiza nada
  return null;
}
