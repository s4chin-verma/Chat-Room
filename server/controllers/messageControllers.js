const Messages = require('../models/messageModels');

module.exports.getAllMessages = async (req, res) => {
  const { from, to } = req.body;

  try {
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt,
      };
    });

    res.status(200).json(projectedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};


module.exports.addMessage = async (req, res) => {
  const { from, to, message } = req.body;

  try {
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      res.status(201).json({ msg: 'Message added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add message to the database' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add message' });
  }
};
