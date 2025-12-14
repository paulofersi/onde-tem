import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_TOKEN_KEY = "@onde_tem:notification_token";

export interface NotificationToken {
  token: string;
  deviceId?: string;
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        // Silenciosamente retorna false em emuladores/simuladores
        // Push notifications só funcionam em dispositivos físicos
        return false;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },

  async registerForPushNotifications(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "19b05993-64ad-443e-be93-7c949fbbde56",
      });

      const token = tokenData.data;
      await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Padrão",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#4CAF50",
          sound: "default",
          showBadge: true,
        });
      }

      return token;
    } catch (error) {
      return null;
    }
  },

  /**
   * Obtém o token de notificação salvo
   */
  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);
    } catch (error) {
      return null;
    }
  },

  async unregister(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
    } catch (error) {
      // Ignore errors
    }
  },

  /**
   * Verifica se as permissões foram concedidas
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === "granted";
    } catch (error) {
      return false;
    }
  },

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: trigger || null,
      });

      return notificationId;
    } catch (error) {
      throw error;
    }
  },

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      // Ignore errors
    }
  },

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      // Ignore errors
    }
  },

  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      return [];
    }
  },

  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  },

  /**
   * Adiciona listener para quando o usuário toca em uma notificação
   */
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  },

  removeNotificationSubscription(
    subscription: Notifications.Subscription
  ): void {
    subscription.remove();
  },

  /**
   * Obtém o número de badges (iOS)
   */
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      return 0;
    }
  },

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      // Ignore errors
    }
  },
};
