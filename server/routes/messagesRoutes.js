const express = require('express');
const router = express.Router();
const { getAllMessages, addMessage } = require('../controllers/messageControllers');
const verifyToken = require('../middleware/verifyToken'); 

router.post('/addmsg',verifyToken, addMessage);
router.get('/getmsg',verifyToken, getAllMessages);

module.exports = router;
