const asyncHandler = require('express-async-handler');
const { Message, Conversation } = require('../models/Message');
const { createNotification } = require('./notificationController');

// @desc    Get or create conversation between two users
// @route   POST /api/chat/conversation
// @access  Private
const getOrCreateConversation = asyncHandler(async (req, res) => {
    const { participantId, applicationId } = req.body;

    if (!participantId) {
        res.status(400);
        throw new Error('Participant ID is required');
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, participantId] }
    }).populate('participants', 'name email role avatar');

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user._id, participantId],
            application: applicationId || undefined
        });
        conversation = await Conversation.findById(conversation._id)
            .populate('participants', 'name email role avatar');
    }

    res.json({ success: true, data: conversation });
});

// @desc    Get all conversations for user
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        participants: req.user._id
    })
        .populate('participants', 'name email role avatar')
        .sort('-lastMessageAt')
        .lean();

    // Get unread count per conversation
    const conversationsWithUnread = await Promise.all(
        conversations.map(async (conv) => {
            const unreadCount = await Message.countDocuments({
                conversation: conv._id,
                sender: { $ne: req.user._id },
                read: false
            });
            return { ...conv, unreadCount };
        })
    );

    res.json({ success: true, data: conversationsWithUnread });
});

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
        res.status(400);
        throw new Error('Conversation ID and content are required');
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    // Check user is participant
    if (!conversation.participants.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        content
    });

    // Update conversation's last message
    conversation.lastMessage = content.substring(0, 100);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Notify the other participant
    const otherParticipant = conversation.participants.find(
        p => p.toString() !== req.user._id.toString()
    );

    if (otherParticipant) {
        await createNotification({
            user: otherParticipant,
            type: 'message',
            title: 'New Message',
            message: `${req.user.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
            link: '/chat'
        });
    }

    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email avatar');

    res.status(201).json({ success: true, data: populatedMessage });
});

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    if (!conversation.participants.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: req.params.conversationId })
        .populate('sender', 'name email avatar')
        .sort('createdAt')
        .skip(skip)
        .limit(limit)
        .lean();

    // Mark messages as read
    await Message.updateMany(
        {
            conversation: req.params.conversationId,
            sender: { $ne: req.user._id },
            read: false
        },
        { read: true }
    );

    res.json({ success: true, data: messages });
});

module.exports = {
    getOrCreateConversation,
    getConversations,
    sendMessage,
    getMessages
};
