import { generateResponse, generateChatTitle } from "../services/ai.service.js"
import chatModel from '../models/chat.model.js'
import messageModel from '../models/message.model.js'

export async function sendMessage(req, res) {
  
  const { message, chatId } = req.body;

  let title = null;
  let chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }else{
    chat = await chatModel.findById(chatId);
  }

  // Existing chat ho ya nayi chat ho,
  // dono case me chat ka id nikal lo
  const currentChatId = chatId || chat._id;

  const userMessage = await messageModel.create({
    chat: currentChatId,
    content: message,
    role: "user",
  });

  // Chat ki puri history nikal lo
  // Isme user aur ai dono ke messages honge
  const messages = await messageModel.find({
    chat: currentChatId,
  }).sort({ createdAt: 1 });


  const result = await generateResponse(messages);

  const textResult = result
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("");

  const aiMessage = await messageModel.create({
    chat: currentChatId,
    content: textResult,
    role: "ai",
  });

  res.status(201).json({
    title,
    chat,
    userMessage,
    aiMessage,
    messages,
  });
}

export async function getChats(req,res){

const user = req.user;

const chats = (await chatModel.find({user: user.id}))

res.status(200).json({
  message: "Chats received successfully",
  chats
})
}

export async function getMessages(req,res){

const { chatId } = req.params;

const chat = await chatModel.findOne({
  _id: chatId,
  user: req.user.id
})

if(!chat){
  return res.status(404).json({
    message:"Chat not Found"
  })
}

const messages = await messageModel.find({
  chat: chatId
})

res.status(200).json({
  messages: "Messages retrieved Successfully",
  messages
})

}

export async function deleteChat(req,res){

const {chatId} = req.params;

const chat = await chatModel.findOne({
  chat: chatId,
  user: req.user.id
})

await messageModel.deleteMany({
  chat: chatId
})

if(!chat){
  return res.status(404).json({
    message: "Chat not Found"
  })
}

res.status(200).json({
  message: "chat deleted successFully"
})


}

