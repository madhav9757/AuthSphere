import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const developerId = req.developer._id;
    const notifications = await Notification.find({ developerId })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      developerId,
      read: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const developerId = req.developer._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, developerId },
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const developerId = req.developer._id;

    await Notification.updateMany({ developerId, read: false }, { read: true });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
