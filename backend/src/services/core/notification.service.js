import Notification from "../../models/notification.model.js";

class NotificationService {
  /**
   * Get notifications for a developer
   */
  async getNotifications(developerId, limit = 20) {
    const notifications = await Notification.find({ developerId })
      .sort({ createdAt: -1 })
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      developerId,
      read: false,
    });

    return { notifications, unreadCount };
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId, developerId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, developerId },
      { read: true },
      { new: true },
    );
  }

  /**
   * Mark all notifications as read for a developer
   */
  async markAllAsRead(developerId) {
    return await Notification.updateMany(
      { developerId, read: false },
      { read: true },
    );
  }
}

export default new NotificationService();
