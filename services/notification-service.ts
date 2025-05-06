import api from '@/utils/api';

/**
 * Interface for notification count with optional delta
 */
export interface NotificationCount {
  count: number;
  delta?: number;
}

/**
 * Interface for the complete notifications overview
 */
export interface NotificationsOverview {
  total: NotificationCount;
  pending: NotificationCount;
  today: NotificationCount;
}

/**
 * Interface for the notifications API response
 */
export interface NotificationsResponse {
  message: {
    message: NotificationsOverview;
  };
}

/**
 * Service responsible for fetching notification data
 */
const NotificationService = {
  /**
   * Get notifications overview data
   * @returns Promise containing notifications overview data
   */
  getNotificationsOverview: async (): Promise<NotificationsOverview> => {
    try {
      const response = await api.get<NotificationsResponse>(
        '/method/fire_alarm_app.custom_api.dashboard_api.get_notifications_overview'
      );

      // Return the message.message object which contains the actual data
      return response.data.message.message;
    } catch (error) {
      console.error('Error fetching notifications overview:', error);
      throw error;
    }
  },
};

export default NotificationService;