import { notificationService } from "@/services/notificationService";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";

export interface UseNotificationsReturn {
  /**
   * Token de push notification do dispositivo
   */
  token: string | null;
  /**
   * Se está carregando o registro de notificações
   */
  loading: boolean;
  /**
   * Erro ao registrar notificações
   */
  error: string | null;
  /**
   * Se as permissões foram concedidas
   */
  hasPermission: boolean;
  /**
   * Registra o dispositivo para receber notificações
   */
  register: () => Promise<void>;
  /**
   * Última notificação recebida
   */
  lastNotification: Notifications.Notification | null;
  /**
   * Última resposta de notificação (quando usuário toca)
   */
  lastNotificationResponse: Notifications.NotificationResponse | null;
}

/**
 * Hook para gerenciar notificações push
 *
 * @example
 * ```tsx
 * const { token, register, hasPermission } = useNotifications();
 *
 * useEffect(() => {
 *   register();
 * }, []);
 * ```
 */
export const useNotifications = (
  autoRegister: boolean = false
): UseNotificationsReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);
  const [lastNotificationResponse, setLastNotificationResponse] =
    useState<Notifications.NotificationResponse | null>(null);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Verificar permissões existentes
    notificationService.checkPermissions().then(setHasPermission);

    // Buscar token salvo
    notificationService.getStoredToken().then((storedToken) => {
      if (storedToken) {
        setToken(storedToken);
      }
    });

    // Registrar automaticamente se solicitado
    if (autoRegister) {
      register();
    }

    notificationListener.current =
      notificationService.addNotificationReceivedListener((notification) => {
        setLastNotification(notification);
      });

    responseListener.current =
      notificationService.addNotificationResponseReceivedListener(
        (response) => {
          setLastNotificationResponse(response);
        }
      );

    return () => {
      if (notificationListener.current) {
        notificationService.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        notificationService.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, [autoRegister]);

  const register = async () => {
    try {
      setLoading(true);
      setError(null);

      const pushToken =
        await notificationService.registerForPushNotifications();

      if (pushToken) {
        setToken(pushToken);
        setHasPermission(true);
      } else {
        setHasPermission(false);
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.message || "";
      if (errorMessage && !errorMessage.includes("dispositivos físicos")) {
        setError(errorMessage);
      } else {
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    loading,
    error,
    hasPermission,
    register,
    lastNotification,
    lastNotificationResponse,
  };
};
