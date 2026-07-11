import axios from "axios";

const api = axios.create({
baseURL: "https://paper-ai-5t5i.onrender.com",
withCredentials: true,  
})


export const sendMessage = async ({message, chatId}) => {
  const response = await api.post("/api/chat/message",{
    message,
    chatId
  })
  return response.data
}

export const getChats = async () => {
  const response = await api.get("/api/chat/")
  return response.data
}

export const getMessages = async (chatId) => {
  const response = await api.get(`/api/chat/${chatId}/messages`)
  return response.data
}

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/api/chat/${chatId}/delete`);
  return response.data
}