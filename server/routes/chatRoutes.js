const express = require('express');
const router = express.Router();
const {
    getOrCreateConversation,
    getConversations,
    sendMessage,
    getMessages
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/conversation', protect, getOrCreateConversation);
router.get('/conversations', protect, getConversations);
router.post('/messages', protect, sendMessage);
router.get('/messages/:conversationId', protect, getMessages);

module.exports = router;
