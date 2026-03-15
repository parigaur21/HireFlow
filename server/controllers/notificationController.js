const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments({ user: req.user._id });
    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    const notifications = await Notification.find({ user: req.user._id })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean();

    res.json({
        success: true,
        data: {
            notifications,
            total,
            unreadCount,
            page,
            pages: Math.ceil(total / limit) || 1
        }
    });
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, data: notification });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, read: false },
        { read: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    res.json({ success: true, message: 'Notification deleted' });
});

// Helper: Create notification (used by other controllers)
const createNotification = async ({ user, type, title, message, link, metadata }) => {
    try {
        await Notification.create({ user, type, title, message, link, metadata });
    } catch (err) {
        console.error('Failed to create notification:', err.message);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
};
