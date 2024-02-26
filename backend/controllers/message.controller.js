import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.js";

export const sendMessage = async (req, res, next) => {
  const { id: receiverId } = req.params;
  const { message } = req.body;
  const { userId: senderId } = req.user;

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const { userId: senderId } = req.user;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate("messages");

  if (!conversation) {
    return res.status(200).json([]);
  }

  res.status(200).json(conversation.messages);

  try {
  } catch (error) {
    next();
  }
};
